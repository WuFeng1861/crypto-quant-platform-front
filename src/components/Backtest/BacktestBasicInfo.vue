<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ $t('backtest.basicInfo') }}</h3>
      <span :class="getStatusClass(backtest.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
        {{ formatBacktestStatus(backtest.status) }}
      </span>
    </div>
    
    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('strategyManager.strategyName') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ getStrategyName(backtest.strategyId) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.tradingPair') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ getTradingPairSymbol(backtest.pairId) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.timeframe') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ getTimeframeName(backtest.timeframeId) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.startTime') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(backtest.startTime) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.endTime') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(backtest.endTime) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.initialCapital') }}</dt>
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
import { useI18n } from 'vue-i18n'

interface Props {
  backtest: BacktestResult
}

defineProps<Props>()

const { t: $t } = useI18n()

const strategyStore = useStrategyStore()
const priceDataStore = usePriceDataStore()

// 获取策略名称
const getStrategyName = (strategyId: number) => {
  return strategyStore.strategies.find(s => s.id === strategyId)?.name || $t('backtest.unknownStrategy')
}

// 获取交易对符号
const getTradingPairSymbol = (pairId: number) => {
  return priceDataStore.tradingPairs.find(p => p.id === pairId)?.symbol || $t('backtest.unknownTradingPair')
}

// 获取时间框架名称
const getTimeframeName = (timeframeId: number) => {
  const timeframe = priceDataStore.getTimeframeById(timeframeId)
  return timeframe?.name || $t('backtest.unknownTimeframe')
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