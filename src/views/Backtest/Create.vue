<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('backtest.create') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          创建新的回测任务
        </p>
      </div>
      <router-link to="/backtest">
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
        label-width="120px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item :label="$t('backtest.selectStrategy')" prop="strategyId">
          <el-select
            v-model="form.strategyId"
            placeholder="选择策略"
            class="w-full"
            filterable
          >
            <el-option
              v-for="strategy in strategyStore.strategies"
              :key="strategy.id"
              :label="strategy.name"
              :value="strategy.id!"
            >
              <div class="flex items-center justify-between">
                <span>{{ strategy.name }}</span>
                <span class="text-xs text-gray-500">
                  {{ strategy.indicatorCount }}指标 {{ strategy.conditionCount }}条件
                </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('backtest.selectTradingPair')" prop="pairId">
          <el-select
            v-model="form.pairId"
            placeholder="选择交易对"
            class="w-full"
            filterable
          >
            <el-option
              v-for="pair in priceDataStore.tradingPairs"
              :key="pair.id"
              :label="pair.symbol"
              :value="pair.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('backtest.selectTimeframe')" prop="timeframeId">
          <el-select
            v-model="form.timeframeId"
            placeholder="选择时间框架"
            class="w-full"
          >
            <el-option
              v-for="timeframe in priceDataStore.timeframes"
              :key="timeframe.id"
              :label="timeframe.name"
              :value="timeframe.id"
            />
          </el-select>
        </el-form-item>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item :label="$t('backtest.startTime')" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择开始时间"
              class="w-full"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>

          <el-form-item :label="$t('backtest.endTime')" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择结束时间"
              class="w-full"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </div>

        <el-form-item :label="$t('backtest.initialCapital')" prop="initialCapital">
          <el-input-number
            v-model="form.initialCapital"
            :min="1000"
            :max="10000000"
            :step="1000"
            class="w-full"
          />
        </el-form-item>

        <el-form-item :label="$t('backtest.earlyStopThreshold')" prop="earlyStopThreshold">
          <el-input-number
            v-model="form.earlyStopThreshold"
            :min="1"
            :max="50"
            :step="1"
            class="w-full"
          />
          <div class="text-xs text-gray-500 mt-1">
            当亏损达到此百分比时提前停止回测（可选）
          </div>
        </el-form-item>

        <el-form-item :label="$t('backtest.positionDivision')" prop="positionDivision">
          <el-input-number
            v-model="form.positionDivision"
            :min="1"
            :max="10"
            :step="1"
            class="w-full"
          />
          <div class="text-xs text-gray-500 mt-1">
            将资金分成几份进行交易（可选）
          </div>
        </el-form-item>

        <!-- 策略预览 -->
        <div v-if="selectedStrategy" class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">策略预览</h4>
          <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div>策略名称: {{ selectedStrategy.name }}</div>
            <div>仓位类型: {{ formatPositionType(selectedStrategy.positionType) }}</div>
            <div>手续费: {{ formatPercent(selectedStrategy.buyFee) }} / {{ formatPercent(selectedStrategy.sellFee) }}</div>
            <div>指标数量: {{ selectedStrategy.indicatorCount }}</div>
            <div>交易条件: {{ selectedStrategy.conditionCount }}</div>
          </div>
        </div>

        <el-form-item class="mt-6">
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
import { useBacktestStore } from '@/stores/backtest'
import { useStrategyStore } from '@/stores/strategies'
import { usePriceDataStore } from '@/stores/priceData'
import { formatPercent, formatPositionType } from '@/utils/format'
import { validationRules } from '@/utils/validation'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { BacktestRequest } from '@/types'

const router = useRouter()
const backtestStore = useBacktestStore()
const strategyStore = useStrategyStore()
const priceDataStore = usePriceDataStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<BacktestRequest>({
  strategyId: 0,
  pairId: 0,
  timeframeId: 0,
  startTime: '',
  endTime: '',
  initialCapital: 10000,
  earlyStopThreshold: 10,
  positionDivision: 1
})

const rules = {
  strategyId: [{ required: true, message: '请选择策略', trigger: 'change' }],
  pairId: [{ required: true, message: '请选择交易对', trigger: 'change' }],
  timeframeId: [{ required: true, message: '请选择时间框架', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  initialCapital: [
    validationRules.required(),
    validationRules.range(1000, 10000000)
  ]
}

const selectedStrategy = computed(() => {
  return strategyStore.strategies.find(s => s.id === form.strategyId)
})

const resetForm = () => {
  formRef.value?.resetFields()
  form.strategyId = 0
  form.pairId = 0
  form.timeframeId = 0
  form.startTime = ''
  form.endTime = ''
  form.initialCapital = 10000
  form.earlyStopThreshold = 10
  form.positionDivision = 1
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 验证时间范围
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      ElMessage.error('结束时间必须晚于开始时间')
      return
    }
    
    loading.value = true
    const result = await backtestStore.createBacktest(form)
    
    if (result.success) {
      ElMessage.success('回测任务创建成功，正在后台执行...')
      router.push('/backtest')
    } else {
      ElMessage.error(result.message || '创建回测失败')
    }
  } catch (error) {
    console.error('创建回测失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 加载基础数据
  await Promise.all([
    strategyStore.fetchStrategies(),
    priceDataStore.fetchTradingPairs(),
    priceDataStore.fetchTimeframes()
  ])
  
  // 设置默认时间范围（最近30天）
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  
  form.endTime = endDate.toISOString().slice(0, 19).replace('T', ' ')
  form.startTime = startDate.toISOString().slice(0, 19).replace('T', ' ')
})
</script>