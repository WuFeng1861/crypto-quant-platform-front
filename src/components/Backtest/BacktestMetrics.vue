<template>
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
</template>

<script setup lang="ts">
import { formatCurrency, formatPercent } from '@/utils/format'
import type { BacktestResult } from '@/types'

interface Props {
  backtest: BacktestResult
}

defineProps<Props>()

const getReturnClass = (value: number) => {
  if (value > 0) return 'text-success-600 dark:text-success-400'
  if (value < 0) return 'text-danger-600 dark:text-danger-400'
  return 'text-gray-900 dark:text-white'
}
</script>