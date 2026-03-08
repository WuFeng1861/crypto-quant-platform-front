<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ t('indicators.edit') }}
        </h1>
        <p class="page-subtitle">
          {{ t('indicators.editSubtitle') }}
        </p>
      </div>
      <router-link to="/indicators">
        <el-button :icon="ArrowLeft">
          {{ t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <!-- 编辑表单 -->
    <div class="card p-6">
      <div v-if="fetchLoading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      <el-form
        v-else
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item :label="t('indicators.name')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="t('indicators.name')"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="t('indicators.description')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :placeholder="t('indicators.description')"
            :rows="3"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="t('indicators.calculationCode')" prop="calculationCode">
          <div class="w-full">
            <CodeEditor
              v-model="form.calculationCode"
              :placeholder="calculationCodePlaceholder"
              language="javascript"
              show-ai-generate
              :ai-loading="aiLoading"
              @ai-generate="generateIndicator"
            />
          </div>
        </el-form-item>

        <el-form-item :label="t('indicators.parameters')">
          <div class="w-full space-y-4">
            <div
              v-for="(parameter, index) in form.parameters"
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('indicators.parameter') }} {{ index + 1 }}
                </h4>
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="removeParameter(index)"
                >
                  {{ t('indicators.removeParameter') }}
                </el-button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <el-form-item
                  :prop="`parameters.${index}.name`"
                  :rules="[{ required: true, message: t('validation.parameterNameRequired'), trigger: 'blur' }]"
                  :label="t('indicators.parameterName')"
                >
                  <el-input
                    v-model="parameter.name"
                    :placeholder="t('indicators.parameterName')"
                  />
                </el-form-item>

                <el-form-item
                  :prop="`parameters.${index}.paramType`"
                  :rules="[{ required: true, message: t('validation.parameterTypeRequired'), trigger: 'change' }]"
                  :label="t('indicators.parameterType')"
                >
                  <el-select v-model="parameter.paramType" :placeholder="t('common.selectType')">
                    <el-option :label="t('common.number')" value="number" />
                    <el-option :label="t('common.string')" value="string" />
                    <el-option :label="t('common.boolean')" value="boolean" />
                  </el-select>
                </el-form-item>

                <el-form-item :label="t('indicators.parameterDescription')">
                  <el-input
                    v-model="parameter.description"
                    :placeholder="t('indicators.parameterDescriptionOptional')"
                  />
                </el-form-item>

                <el-form-item :label="t('indicators.defaultValue')">
                  <el-input
                    v-model="parameter.defaultValue"
                    :placeholder="t('indicators.defaultValueOptional')"
                  />
                </el-form-item>
              </div>
            </div>

            <el-button
              type="primary"
              plain
              @click="addParameter"
              :icon="Plus"
            >
              {{ t('indicators.addParameter') }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="flex space-x-4">
            <el-button
              type="primary"
              @click="handleSubmit"
              :loading="loading"
            >
              {{ t('common.save') }}
            </el-button>
            <el-button @click="resetForm">
              {{ t('common.reset') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { useIndicatorStore } from '@/stores/indicators'
import { validationRules } from '@/utils/validation'
import CodeEditor from '@/components/Common/CodeEditor.vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import type { Indicator } from '@/types'
import { useI18n } from 'vue-i18n'
import { aiIndicatorApi } from '@/api/aiIndicator'
import { indicatorApi } from '@/api/indicators'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const indicatorStore = useIndicatorStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const fetchLoading = ref(true)
const aiLoading = ref(false)
const indicatorId = Number(route.params.id)

const form = reactive<Omit<Indicator, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  description: '',
  calculationCode: '',
  parameters: []
})

const rules = {
  name: [validationRules.required(), validationRules.maxLength(100)],
  calculationCode: [validationRules.required()]
}

const calculationCodePlaceholder = `// ${t('indicators.calculationFunctionExample')}
// ${t('indicators.calculationFunctionParams')}
function calculate(priceData, parameters) {
  const period = parameters.period || 14;
  const result = [];
  
  for (let i = 0; i < priceData.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    
    // ${t('indicators.calculateSMA')}
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += priceData[j].closePrice;
    }
    result.push(sum / period);
  }
  
  return result;
}`

const loadIndicatorData = async () => {
  if (!indicatorId) return
  
  fetchLoading.value = true
  try {
    const data = await indicatorApi.getById(indicatorId)
    form.name = data.name
    form.description = data.description || ''
    form.calculationCode = data.calculationCode
    form.parameters = data.parameters.map(p => ({
      name: p.name,
      description: p.description || '',
      defaultValue: p.defaultValue || '',
      paramType: p.paramType
    }))
  } catch (error) {
    console.error('获取指标详情失败:', error)
    ElMessage.error(t('indicators.fetchDetailFailed'))
    router.push('/indicators')
  } finally {
    fetchLoading.value = false
  }
}

onMounted(() => {
  loadIndicatorData()
})

const addParameter = () => {
  form.parameters.push({
    name: '',
    description: '',
    defaultValue: '',
    paramType: 'number'
  })
}

const removeParameter = (index: number) => {
  form.parameters.splice(index, 1)
}

const resetForm = () => {
  loadIndicatorData()
}

// AI生成指标函数
const generateIndicator = async () => {
  if (!form.name || !form.description) {
    ElMessage.warning(t('indicators.aiGenerateWarning'))
    return
  }

  aiLoading.value = true
  try {
    const userInput = `创建一个${form.description}的${form.name}的指标`
    
    const response = await aiIndicatorApi.generate({ userInput })
    
    if (response.success && response.generatedCode) {
      form.calculationCode = response.generatedCode.code
      form.parameters = []
      
      response.generatedCode.parameters.forEach((param: any) => {
        form.parameters.push({
          name: param.name,
          paramType: param.paramType,
          defaultValue: param.defaultValue,
          description: param.description
        })
      })
      
      ElMessage.success(t('indicators.aiGenerateSuccess'))
    } else {
      ElMessage.error(t('indicators.aiGenerateFailed'))
    }
  } catch (error: any) {
    console.error('AI生成指标失败:', error)
    handleAIError(error)
  } finally {
    aiLoading.value = false
  }
}

const handleAIError = (error: any) => {
  const status = error.response?.status
  const message = error.response?.data?.message
  
  if (status === 400) {
    if (message?.includes('过长')) {
      ElMessage.error(t('indicators.aiInputTooLong'))
    } else if (message?.includes('名称') || message?.includes('name')) {
      ElMessage.error(t('indicators.aiNameFormatError'))
    } else if (message?.includes('安全') || message?.includes('unsafe')) {
      ElMessage.error(t('indicators.aiCodeSecurityError'))
    } else {
      ElMessage.error(message || t('indicators.aiGenerateFailed'))
    }
  } else if (status === 409) {
    ElMessage.error(t('indicators.aiNameExists'))
  } else {
    ElMessage.error(message || t('indicators.aiGenerateFailed'))
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await indicatorStore.updateIndicator(indicatorId, form)
    ElMessage.success(t('indicators.updateSuccess'))
    router.push('/indicators')
  } catch (error) {
    console.error(`${t('indicators.updateFailed')}:`, error)
  } finally {
    loading.value = false
  }
}
</script>
