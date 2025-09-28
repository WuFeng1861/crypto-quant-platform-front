<template>
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
</template>

<script setup lang="ts">
import { useStrategyStore } from '@/stores/strategies'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime, formatCurrency, formatBacktestStatus } from '@/utils/format'
import type { BacktestResult } from '@/types'

interface Props {
  backtest: BacktestResult
}

defineProps<Props>()

const strategyStore = useStrategyStore()
const priceDataStore = usePriceDataStore()

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
</script>