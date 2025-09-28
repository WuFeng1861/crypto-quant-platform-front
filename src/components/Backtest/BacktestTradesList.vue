<template>
  <div v-if="backtest.status === 'completed'" class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">交易记录</h3>
      <el-button @click="$emit('refresh')" :loading="loading">
        {{ loading ? '加载中...' : '刷新' }}
      </el-button>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
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
</template>

<script setup lang="ts">
import { formatTime, formatCurrency } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import type { BacktestResult, Trade } from '@/types'

interface Props {
  backtest: BacktestResult
  trades: Trade[]
  loading: boolean
}

defineProps<Props>()
defineEmits<{
  refresh: []
}>()

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

const getReturnClass = (value: number) => {
  if (value > 0) return 'text-success-600 dark:text-success-400'
  if (value < 0) return 'text-danger-600 dark:text-danger-400'
  return 'text-gray-900 dark:text-white'
}
</script>