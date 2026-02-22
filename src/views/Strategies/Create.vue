<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('strategies.create') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('common.createNewStrategy') }}
        </p>
      </div>
      <router-link to="/strategies">
        <el-button :icon="ArrowLeft">
          {{ $t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <div class="card p-6">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ $t('strategies.aiGenerate') }}
            </h3>
          </div>
          
          <el-form-item :label="$t('strategies.aiInputDescription')">
            <el-input
              v-model="aiInput"
              type="textarea"
              :placeholder="$t('strategies.aiInputPlaceholder')"
              :rows="4"
              maxlength="5000"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              @click="generateStrategy"
              :loading="aiLoading"
              :icon="MagicStick"
            >
              {{ $t('strategies.aiGenerate') }}
            </el-button>
          </el-form-item>
        </div>

        <StrategyBasicInfo :form="form" />

        <StrategyRiskManagement :form="form" />

        <StrategyIndicators :form="form" :ai-indicators="aiGeneratedData?.indicators" />

        <StrategyConditions :form="form" />

        <el-form-item>
          <div class="flex space-x-4">
            <el-button
              type="primary"
              @click="handleSubmit"
              :loading="loading"
            >
              {{ $t('common.create') }}
            </el-button>
            <el-button @click="resetForm">
              {{ $t('common.reset') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      v-model="showPreviewDialog"
      :title="$t('strategies.aiGeneratedStrategy')"
      width="80%"
      top="5vh"
    >
      <div v-if="aiGeneratedData" class="space-y-6 max-h-[70vh] overflow-y-auto">
        <div class="card p-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
            {{ $t('strategies.basicInfo') }}
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ $t('strategies.name') }}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ aiGeneratedData.name }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ $t('strategies.positionType') }}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ $t(`strategies.positionTypes.${aiGeneratedData.positionType}`) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ $t('strategies.buyFee') }}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ (aiGeneratedData.buyFee * 100).toFixed(1) }}%</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">{{ $t('strategies.sellFee') }}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ (aiGeneratedData.sellFee * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <div v-if="aiGeneratedData.description" class="mt-3 text-sm">
            <span class="text-gray-500 dark:text-gray-400">{{ $t('strategies.description') }}:</span>
            <span class="ml-2 text-gray-900 dark:text-white">{{ aiGeneratedData.description }}</span>
          </div>
        </div>

        <div class="card p-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
            {{ $t('strategies.indicators') }} ({{ aiGeneratedData.indicators?.length || 0 }})
          </h4>
          <div class="space-y-3">
            <div
              v-for="(indicator, index) in aiGeneratedData.indicators"
              :key="indicator.id || index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ indicator.name }}</span>
                  <span class="text-xs text-blue-500 ml-2">(ID: {{ indicator.id }})</span>
                </div>
                <span class="text-xs text-gray-500">{{ indicator.description }}</span>
              </div>
              <div v-if="indicator.parameters?.length" class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('strategies.parameters') }}:
                <span v-for="(param, pIndex) in indicator.parameters" :key="param.id || pIndex" class="ml-2">
                  {{ param.name }}={{ param.value }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
            {{ $t('strategies.conditions') }} ({{ aiGeneratedData.conditions?.length || 0 }})
          </h4>
          <div class="space-y-3">
            <div
              v-for="(condition, index) in aiGeneratedData.conditions"
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <el-tag :type="condition.action === 'buy' ? 'success' : 'danger'" size="small">
                    {{ condition.action === 'buy' ? $t('common.buy') : $t('common.sell') }}
                  </el-tag>
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ $t('strategies.indicatorIndex') }} {{ condition.indicatorIndex }}
                    {{ condition.operator }}
                    <template v-if="condition.comparisonType === 'constant'">
                      {{ condition.constantValue }}
                    </template>
                    <template v-else>
                      {{ $t('strategies.indicatorIndex') }} {{ condition.comparedIndicatorIndex }}
                    </template>
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ $t('strategies.conditionType') }}: {{ $t(`strategies.conditionTypes.${condition.conditionType}`) }}
                  | {{ $t('strategies.conditionGroup') }}: {{ condition.group }}
                </div>
              </div>
              <div v-if="condition.customCode" class="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2">
                <code>{{ condition.customCode }}</code>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
            {{ $t('strategies.createdIndicators') }} ({{ aiGeneratedData.createdIndicators?.length || 0 }})
          </h4>
          <div class="space-y-4">
            <div
              v-for="(indicator, index) in aiGeneratedData.createdIndicators"
              :key="indicator.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ indicator.name }}</span>
                  <span class="text-xs text-blue-500 ml-2">(ID: {{ indicator.id }})</span>
                </div>
                <span class="text-xs text-gray-500">{{ indicator.description }}</span>
              </div>
              <div v-if="indicator.parameters?.length" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {{ $t('strategies.parameters') }}:
                <span v-for="(param, pIndex) in indicator.parameters" :key="param.id" class="ml-2">
                  {{ param.name }}={{ param.defaultValue }} ({{ param.paramType }})
                </span>
              </div>
              <div v-if="indicator.calculationCode" class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2 max-h-20 overflow-y-auto">
                <code>{{ indicator.calculationCode }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showPreviewDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="applyGeneratedData">{{ $t('strategies.applyGenerated') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance } from 'element-plus'
import { useStrategyStore } from '@/stores/strategies'
import { useIndicatorStore } from '@/stores/indicators'
import { validationRules } from '@/utils/validation'
import { ArrowLeft, MagicStick } from '@element-plus/icons-vue'
import StrategyBasicInfo from '@/components/Strategy/StrategyBasicInfo.vue'
import StrategyRiskManagement from '@/components/Strategy/StrategyRiskManagement.vue'
import StrategyIndicators from '@/components/Strategy/StrategyIndicators.vue'
import StrategyConditions from '@/components/Strategy/StrategyConditions.vue'
import { aiStrategyApi } from '@/api/aiStrategy'
import type { CreateStrategyRequest, AIGeneratedStrategy } from '@/types'

const router = useRouter()
const { t } = useI18n()
const strategyStore = useStrategyStore()
const indicatorStore = useIndicatorStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const aiLoading = ref(false)
const aiInput = ref('')
const showPreviewDialog = ref(false)
const aiGeneratedData = ref<AIGeneratedStrategy | null>(null)

const form = reactive<CreateStrategyRequest>({
  name: '',
  description: '',
  positionType: 'long',
  buyFee: 0.001,
  sellFee: 0.001,
  liquidationThreshold: 90,
  takeProfitRatio: undefined,
  stopLossRatio: undefined,
  indicators: [],
  conditions: []
})

const rules = {
  name: [validationRules.required(), validationRules.maxLength(100)],
  positionType: [validationRules.required()],
  buyFee: [validationRules.required(), validationRules.range(0, 1)],
  sellFee: [validationRules.required(), validationRules.range(0, 1)],
  liquidationThreshold: [validationRules.required(), validationRules.range(0, 100)],
  takeProfitRatio: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === undefined || value === null || value === '') {
          callback()
        } else if (value <= 100) {
          callback(new Error(t('validation.takeProfitRatioError')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  stopLossRatio: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === undefined || value === null || value === '') {
          callback()
        } else if (value <= 0 || value >= 100) {
          callback(new Error(t('validation.stopLossRatioError')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const generateStrategy = async () => {
  if (!aiInput.value.trim()) {
    ElMessage.warning(t('strategies.aiInputRequired'))
    return
  }
  
  if (aiInput.value.length > 5000) {
    ElMessage.warning(t('strategies.aiInputTooLong'))
    return
  }
  
  aiLoading.value = true
  try {
    const response = await aiStrategyApi.generate({ userInput: aiInput.value })
    
    if (response.success && response.generatedStrategy) {
      aiGeneratedData.value = response.generatedStrategy
      showPreviewDialog.value = true
      ElMessage.success(t('strategies.aiGenerateSuccess'))
    } else {
      ElMessage.error(t('strategies.aiGenerateFailed'))
    }
  } catch (error: any) {
    console.error('AI生成策略失败:', error)
    const message = error.response?.data?.message || t('strategies.aiGenerateFailed')
    ElMessage.error(message)
  } finally {
    aiLoading.value = false
  }
}

const applyGeneratedData = () => {
  if (!aiGeneratedData.value) return
  
  const data = aiGeneratedData.value
  
  form.name = data.name || ''
  form.description = data.description || ''
  form.positionType = data.positionType || 'long'
  form.buyFee = data.buyFee || 0.001
  form.sellFee = data.sellFee || 0.001
  form.liquidationThreshold = data.liquidationThreshold || 90
  // takeProfitRatio: 后端返回小数形式(0.1=10%)，界面需要整数百分比(10)
  if (data.takeProfitRatio !== null && data.takeProfitRatio !== undefined) {
    form.takeProfitRatio = Math.round(data.takeProfitRatio * 100)
  } else {
    form.takeProfitRatio = undefined
  }
  
  // stopLossRatio: 后端返回小数形式(0.05=5%)，界面需要整数百分比(5)
  if (data.stopLossRatio !== null && data.stopLossRatio !== undefined) {
    form.stopLossRatio = Math.round(data.stopLossRatio * 100)
  } else {
    form.stopLossRatio = undefined
  }
  
  form.indicators = data.indicators?.map((ind, index) => ({
    indicatorId: ind.id || 0,
    priority: index + 1,
    parameters: ind.parameters?.map(p => ({
      parameterId: p.id || 0,
      value: p.value
    })) || []
  })) || []
  
  form.conditions = data.conditions?.map(cond => ({
    indicatorIndex: cond.indicatorIndex,
    comparisonType: cond.comparisonType,
    comparedIndicatorIndex: cond.comparedIndicatorIndex,
    constantValue: cond.constantValue,
    currentValuePath: cond.currentValuePath || '',
    comparedValuePath: cond.comparedValuePath || '',
    operator: cond.operator,
    conditionType: cond.conditionType,
    action: cond.action,
    group: cond.group || 1,
    priority: cond.priority || 1,
    customCode: cond.customCode || ''
  })) || []
  
  showPreviewDialog.value = false
  ElMessage.success(t('strategies.aiApplySuccess'))
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.indicators = []
  form.conditions = []
  aiInput.value = ''
  aiGeneratedData.value = null
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.indicators.length === 0) {
      ElMessage.error(t('common.atLeastOneIndicator'))
      return
    }
    
    if (form.conditions.length === 0) {
      ElMessage.error(t('common.atLeastOneCondition'))
      return
    }
    
    loading.value = true
    await strategyStore.createStrategy(form)
    ElMessage.success(`${t('strategies.title')}${t('common.createSuccess')}`)
    router.push('/strategies')
  } catch (error) {
    console.error(`${t('strategies.create')}${t('common.createFailed')}:`, error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  indicatorStore.fetchIndicators()
})
</script>
