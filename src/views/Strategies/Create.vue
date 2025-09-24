<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('strategies.create') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          创建新的交易策略
        </p>
      </div>
      <router-link to="/strategies">
        <el-button :icon="ArrowLeft">
          {{ $t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <!-- 创建表单 -->
    <div class="card p-6">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <!-- 基本信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">基本信息</h3>
          
          <el-form-item :label="$t('strategies.name')" prop="name">
            <el-input
              v-model="form.name"
              :placeholder="$t('strategies.name')"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item :label="$t('strategies.description')" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :placeholder="$t('strategies.description')"
              :rows="3"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item :label="$t('strategies.positionType')" prop="positionType">
            <el-select v-model="form.positionType" placeholder="选择仓位类型">
              <el-option label="做多" value="long" />
              <el-option label="做空" value="short" />
              <el-option label="双向" value="both" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 风险管理 -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">风险管理</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item :label="$t('strategies.buyFee')" prop="buyFee">
              <el-input-number
                v-model="form.buyFee"
                :min="0"
                :max="1"
                :step="0.000001"
                :precision="6"
                class="w-full"
              />
            </el-form-item>

            <el-form-item :label="$t('strategies.sellFee')" prop="sellFee">
              <el-input-number
                v-model="form.sellFee"
                :min="0"
                :max="1"
                :step="0.000001"
                :precision="6"
                class="w-full"
              />
            </el-form-item>

            <el-form-item :label="$t('strategies.liquidationThreshold')" prop="liquidationThreshold">
              <el-input-number
                v-model="form.liquidationThreshold"
                :min="0"
                :max="100"
                :step="1"
                class="w-full"
              />
            </el-form-item>

            <el-form-item :label="$t('strategies.takeProfitRatio')" prop="takeProfitRatio">
              <el-input-number
                v-model="form.takeProfitRatio"
                :min="0"
                :max="10"
                :step="0.1"
                :precision="2"
                class="w-full"
              />
            </el-form-item>

            <el-form-item :label="$t('strategies.stopLossRatio')" prop="stopLossRatio">
              <el-input-number
                v-model="form.stopLossRatio"
                :min="0"
                :max="1"
                :step="0.1"
                :precision="2"
                class="w-full"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 指标配置 -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">指标配置</h3>
            <el-button type="primary" plain @click="addIndicator" :icon="Plus">
              {{ $t('strategies.addIndicator') }}
            </el-button>
          </div>

          <div v-if="form.indicators.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            暂未添加指标，请点击上方按钮添加
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(indicator, index) in form.indicators"
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  指标 {{ index + 1 }}
                </h4>
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="removeIndicator(index)"
                >
                  移除
                </el-button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <el-form-item
                  :prop="`indicators.${index}.indicatorId`"
                  :rules="[{ required: true, message: '请选择指标', trigger: 'change' }]"
                  label="选择指标"
                >
                  <el-select
                    v-model="indicator.indicatorId"
                    placeholder="选择指标"
                    @change="handleIndicatorChange(index)"
                    class="w-full"
                  >
                    <el-option
                      v-for="ind in indicatorStore.indicators"
                      :key="ind.id"
                      :label="ind.name"
                      :value="ind.id!"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="优先级">
                  <el-input-number
                    v-model="indicator.priority"
                    :min="1"
                    :max="100"
                    class="w-full"
                  />
                </el-form-item>
              </div>

              <!-- 参数配置 -->
              <div v-if="getIndicatorById(indicator.indicatorId)?.parameters?.length" class="mt-4">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参数配置</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="param in getIndicatorById(indicator.indicatorId)?.parameters || []"
                    :key="param.id"
                    class="space-y-1"
                  >
                    <label class="block text-sm text-gray-600 dark:text-gray-400">
                      {{ param.name }}
                    </label>
                    <el-input
                      :model-value="getParameterValue(index, param.id!)"
                      @input="(value: string) => setParameterValue(index, param.id!, value)"
                      :placeholder="param.defaultValue || `请输入${param.name}`"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 交易条件 -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">交易条件</h3>
            <el-button type="primary" plain @click="addCondition" :icon="Plus">
              {{ $t('strategies.addCondition') }}
            </el-button>
          </div>

          <div v-if="form.conditions.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            暂未添加交易条件，请点击上方按钮添加
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(condition, index) in form.conditions"
              :key="index"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  条件 {{ index + 1 }}
                </h4>
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="removeCondition(index)"
                >
                  移除
                </el-button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <el-form-item label="条件类型">
                  <el-select v-model="condition.conditionType" placeholder="条件类型" class="w-full">
                    <el-option label="信号条件" value="signal" />
                    <el-option label="自定义代码" value="custom" />
                  </el-select>
                </el-form-item>

                <el-form-item label="执行动作">
                  <el-select v-model="condition.action" placeholder="选择动作" class="w-full">
                    <el-option label="买入" value="buy" />
                    <el-option label="卖出" value="sell" />
                    <el-option label="无操作" value="none" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="condition.conditionType === 'signal'" label="指标索引">
                  <el-select v-model="condition.indicatorIndex" placeholder="选择指标" class="w-full">
                    <el-option
                      v-for="(ind, idx) in form.indicators"
                      :key="idx"
                      :label="`指标${idx + 1}`"
                      :value="idx"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <div v-if="condition.conditionType === 'signal'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <el-form-item label="比较类型">
                  <el-select v-model="condition.comparisonType" placeholder="比较类型" class="w-full">
                    <el-option label="与指标比较" value="indicator" />
                    <el-option label="与常量比较" value="constant" />
                  </el-select>
                </el-form-item>

                <el-form-item label="操作符">
                  <el-select v-model="condition.operator" placeholder="选择操作符" class="w-full">
                    <el-option label="大于 >" value=">" />
                    <el-option label="小于 <" value="<" />
                    <el-option label="大于等于 >=" value=">=" />
                    <el-option label="小于等于 <=" value="<=" />
                    <el-option label="等于 ==" value="==" />
                    <el-option label="不等于 !=" value="!=" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="condition.comparisonType === 'indicator'" label="比较指标">
                  <el-select v-model="condition.comparedIndicatorIndex" placeholder="选择指标" class="w-full">
                    <el-option
                      v-for="(ind, idx) in form.indicators"
                      :key="idx"
                      :label="`指标${idx + 1}`"
                      :value="idx"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="condition.comparisonType === 'constant'" label="常量值">
                  <el-input v-model="condition.constantValue" placeholder="输入常量值" />
                </el-form-item>
              </div>

              <div v-if="condition.conditionType === 'custom'" class="mt-4">
                <el-form-item label="自定义代码" class="w-full">
                  <CodeEditor
                    v-model="condition.customCode"
                    placeholder="请输入自定义条件代码..."
                    language="javascript"
                    :readonly="false"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { useStrategyStore } from '@/stores/strategies'
import { useIndicatorStore } from '@/stores/indicators'
import { validationRules } from '@/utils/validation'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import CodeEditor from '@/components/Common/CodeEditor.vue'
import type { Strategy, StrategyIndicator, StrategyCondition } from '@/types'

const router = useRouter()
const strategyStore = useStrategyStore()
const indicatorStore = useIndicatorStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  description: '',
  positionType: 'long',
  buyFee: 0.001,
  sellFee: 0.001,
  liquidationThreshold: 10,
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
  liquidationThreshold: [validationRules.required(), validationRules.range(0, 100)]
}

const getIndicatorById = (id: number) => {
  return indicatorStore.indicators.find(ind => ind.id === id)
}

const getParameterValue = (indicatorIndex: number, parameterId: number) => {
  const indicator = form.indicators[indicatorIndex]
  const param = indicator.parameters.find(p => p.parameterId === parameterId)
  return param?.value || ''
}

const setParameterValue = (indicatorIndex: number, parameterId: number, value: string) => {
  const indicator = form.indicators[indicatorIndex]
  const param = indicator.parameters.find(p => p.parameterId === parameterId)
  if (param) {
    param.value = value
  }
}

const addIndicator = () => {
  form.indicators.push({
    indicatorId: 0,
    priority: 1,
    parameters: []
  })
}

const removeIndicator = (index: number) => {
  form.indicators.splice(index, 1)
}

const handleIndicatorChange = (index: number) => {
  const indicator = form.indicators[index]
  const selectedIndicator = getIndicatorById(indicator.indicatorId)
  
  if (selectedIndicator) {
    indicator.parameters = selectedIndicator.parameters.map(param => ({
      parameterId: param.id!,
      value: param.defaultValue || ''
    }))
  }
}

const addCondition = () => {
  form.conditions.push({
    indicatorIndex: 0,
    comparisonType: 'constant',
    operator: '>',
    conditionType: 'signal',
    action: 'buy',
    constantValue: '',
    customCode: ''
  })
}

const removeCondition = (index: number) => {
  form.conditions.splice(index, 1)
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.indicators = []
  form.conditions = []
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.indicators.length === 0) {
      ElMessage.error('请至少添加一个指标')
      return
    }
    
    if (form.conditions.length === 0) {
      ElMessage.error('请至少添加一个交易条件')
      return
    }
    
    loading.value = true
    await strategyStore.createStrategy(form)
    ElMessage.success('策略创建成功')
    router.push('/strategies')
  } catch (error) {
    console.error('创建策略失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  indicatorStore.fetchIndicators()
})
</script>