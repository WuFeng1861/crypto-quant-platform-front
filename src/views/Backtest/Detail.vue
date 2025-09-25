<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          回测详情
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看回测结果和交易记录
        </p>
      </div>
      <router-link to="/backtest">
        <el-button :icon="ArrowLeft">
          {{ $t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="backtest" class="space-y-6">
      <!-- 基本信息 -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">基本信息</h3>
          <span :class="getStatusClass(backtest.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
            {{ formatBacktestStatus(backtest.status) }}
          </span>
        </div>
        
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">策略名称</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ getStrategyName(backtest.strategyId) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">交易对</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ getTradingPairSymbol(backtest.pairId) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">时间框架</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ getTimeframeName(backtest.timeframeId) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">开始时间</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(backtest.startTime) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">结束时间</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(backtest.endTime) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">初始资金</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatCurrency(backtest.initialCapital) }}</dd>
          </div>
        </dl>
      </div>

      <!-- 收益指标 -->
      <div v-if="backtest.status === 'completed'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">最终资金</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(backtest.finalCapital) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">总收益</p>
              <p class="text-2xl font-bold" :class="getReturnClass(parseFloat(backtest.totalProfit || '0'))">
                {{ formatCurrency(backtest.totalProfit) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">收益率</p>
              <p class="text-2xl font-bold" :class="getReturnClass(parseFloat(backtest.profitRate || '0'))">
                {{ formatPercent(parseFloat(backtest.profitRate || '0'), 2, false) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">最大回撤</p>
              <p class="text-2xl font-bold text-danger-600 dark:text-danger-400">
                {{ formatPercent(backtest.maxDrawdown, 2, false) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 交易统计 -->
      <div v-if="backtest.status === 'completed'" class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">交易统计</h3>
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">总交易次数</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ backtest.totalTrades }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">盈利次数</dt>
            <dd class="mt-1 text-sm text-success-600 dark:text-success-400">{{ backtest.winningTrades }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">亏损次数</dt>
            <dd class="mt-1 text-sm text-danger-600 dark:text-danger-400">{{ backtest.losingTrades }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">胜率</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ formatPercent(backtest.winRate, 2, false) }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- 收益曲线图 -->
      <div v-if="backtest.status === 'completed'" class="card p-6">
        <ProfitChart 
          :trades="trades" 
          :initial-capital="parseFloat(backtest.initialCapital)"
          :loading="loadingTrades"
        />
      </div>

      <!-- 交易记录 -->
      <div v-if="backtest.status === 'completed'" class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">交易记录</h3>
          <el-button @click="loadTrades" :loading="loadingTrades">
            {{ loadingTrades ? '加载中...' : '刷新' }}
          </el-button>
        </div>

        <div v-if="loadingTrades" class="flex justify-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="!trades.length" class="text-center py-8">
          <EmptyState message="暂无交易记录" />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  交易时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  类型
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  价格
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  数量
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  手续费
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  盈亏
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="trade in trades" :key="trade.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatTime(trade.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTradeTypeClass(trade.tradeType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatTradeType(trade.tradeType) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatCurrency(trade.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ trade.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatCurrency(trade.fee) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getReturnClass(parseFloat(trade.profit || '0'))">
                  {{ formatCurrency(trade.profit || '0') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 运行中状态 -->
      <div v-else-if="backtest.status === 'running'" class="card p-6 text-center">
        <LoadingSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">回测正在执行中，请稍候...</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
          预计完成时间: {{ estimatedCompletionTime }}
        </p>
      </div>

      <!-- 失败状态 -->
      <div v-else-if="backtest.status === 'failed'" class="card p-6 text-center">
        <div class="text-danger-600 dark:text-danger-400">
          <p class="text-lg font-medium">回测执行失败</p>
          <p class="mt-2 text-sm">{{ backtest.earlyStopReason || '未知错误' }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <EmptyState message="回测不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBacktestStore } from '@/stores/backtest'
import { useStrategyStore } from '@/stores/strategies'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime, formatCurrency, formatPercent, formatBacktestStatus } from '@/utils/format'
import { ArrowLeft } from '@element-plus/icons-vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import ProfitChart from '@/components/Common/ProfitChart.vue'
import type { Trade } from '@/types'

const route = useRoute()
const backtestStore = useBacktestStore()
const strategyStore = useStrategyStore()
const priceDataStore = usePriceDataStore()

const loading = ref(true)
const loadingTrades = ref(false)
const trades = ref<Trade[]>([])
let statusCheckInterval: NodeJS.Timeout | null = null

const backtest = computed(() => {
  const id = Number(route.params.id)
  return backtestStore.backtests.find(b => b.id === id)
})

const estimatedCompletionTime = computed(() => {
  // 简单的估算逻辑
  return '约5-10分钟'
})

// 获取策略名称
const getStrategyName = (strategyId: number) => {
  return strategyStore.strategies.find(s => s.id === strategyId)?.name || '未知策略'
}

// 获取交易对符号
const getTradingPairSymbol = (pairId: number) => {
  return priceDataStore.tradingPairs.find(p => p.id === pairId)?.symbol || '未知交易对'
}

// 获取时间框架名称
const getTimeframeName = (timeframeId: number) => {
  const timeframe = priceDataStore.getTimeframeById(timeframeId)
  return timeframe?.name || '未知时间框架'
}

const getStatusClass = (status: string) => {
  const classes = {
    running: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    completed: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    failed: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getReturnClass = (value: number) => {
  if (value > 0) return 'text-success-600 dark:text-success-400'
  if (value < 0) return 'text-danger-600 dark:text-danger-400'
  return 'text-gray-900 dark:text-white'
}

const getTradeTypeClass = (type: string) => {
  const classes = {
    buy: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    sell: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatTradeType = (type: string) => {
  const types = {
    buy: '买入',
    sell: '卖出'
  }
  return types[type as keyof typeof types] || type
}

const loadTrades = async () => {
  if (!backtest.value) return
  
  loadingTrades.value = true
  try {
    await backtestStore.fetchTrades(backtest.value.id!)
    trades.value = backtestStore.currentTrades
  } catch (error) {
    console.error('加载交易记录失败:', error)
  } finally {
    loadingTrades.value = false
  }
}

const checkStatus = async () => {
  if (!backtest.value || backtest.value.status !== 'running') return
  
  try {
    await backtestStore.fetchBacktestById(backtest.value.id!)
  } catch (error) {
    console.error('检查回测状态失败:', error)
  }
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    
    // 并行加载必要的数据
    await Promise.all([
      backtestStore.fetchBacktestById(id),
      priceDataStore.fetchTimeframes(),
      priceDataStore.fetchTradingPairs(),
      strategyStore.fetchStrategies()
    ])
    
    // 如果回测已完成，加载交易记录
    if (backtest.value?.status === 'completed') {
      await loadTrades()
    }
    
    // 如果回测正在运行，启动状态检查
    if (backtest.value?.status === 'running') {
      statusCheckInterval = setInterval(checkStatus, 30000) // 每30秒检查一次
    }
  } catch (error) {
    console.error('加载回测详情失败:', error)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>