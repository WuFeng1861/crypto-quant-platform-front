<template>
  <div v-if="backtest.status === 'completed'" class="theme-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium theme-text-primary">交易记录</h3>
      <div class="flex items-center space-x-2">
        <span class="text-sm theme-text-secondary">
          共 {{ trades.length }} 笔交易
        </span>
        <el-button @click="$emit('refresh')" :loading="loading" size="small">
          {{ loading ? '加载中...' : '刷新' }}
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="!trades.length" class="text-center py-8">
      <EmptyState 
        title="暂无交易记录" 
        description="该回测还没有产生任何交易"
        :icon="null"
      />
    </div>

    <div v-else class="overflow-x-auto">
      <table class="theme-table">
        <thead class="theme-table-header">
          <tr>
            <th class="theme-table-header-cell">ID</th>
            <th class="theme-table-header-cell">交易时间</th>
            <th class="theme-table-header-cell">类型</th>
            <th class="theme-table-header-cell">价格</th>
            <th class="theme-table-header-cell">数量</th>
            <th class="theme-table-header-cell">成交金额</th>
            <th class="theme-table-header-cell">手续费</th>
            <th class="theme-table-header-cell">盈亏金额</th>
            <th class="theme-table-header-cell">盈亏率</th>
            <th class="theme-table-header-cell">账户余额</th>
            <th class="theme-table-header-cell">信号指标</th>
            <th class="theme-table-header-cell">创建时间</th>
          </tr>
        </thead>
        <tbody class="theme-table-body">
          <tr v-for="trade in trades" :key="trade.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="theme-table-cell-secondary">
              #{{ trade.id }}
            </td>
            <td class="theme-table-cell">
              <div class="flex flex-col">
                <span class="font-medium">{{ formatDate(trade.timestamp) }}</span>
                <span class="text-xs theme-text-secondary">{{ formatTime(trade.timestamp) }}</span>
              </div>
            </td>
            <td class="theme-table-cell">
              <span :class="getTradeTypeClass(trade.tradeType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ formatTradeType(trade.tradeType) }}
              </span>
            </td>
            <td class="theme-table-cell">
              <span class="font-mono">{{ formatCurrency(trade.price) }}</span>
            </td>
            <td class="theme-table-cell">
              <span class="font-mono">{{ formatAmount(trade.amount) }}</span>
            </td>
            <td class="theme-table-cell">
              <span class="font-mono font-medium">{{ formatCurrency(calculateTradeValue(trade)) }}</span>
            </td>
            <td class="theme-table-cell">
              <span class="font-mono theme-text-secondary">{{ formatCurrency(trade.fee) }}</span>
            </td>
            <td class="theme-table-cell">
              <span v-if="trade.profit" :class="getReturnClass(parseFloat(trade.profit))" class="font-mono font-medium">
                {{ formatCurrency(trade.profit) }}
              </span>
              <span v-else class="theme-text-muted">-</span>
            </td>
            <td class="theme-table-cell">
              <span v-if="trade.profitRate" :class="getReturnClass(parseFloat(trade.profitRate))" class="font-mono font-medium">
                {{ formatPercent(trade.profitRate, 2, false) }}
              </span>
              <span v-else class="theme-text-muted">-</span>
            </td>
            <td class="theme-table-cell">
              <span class="font-mono font-medium">{{ formatCurrency(trade.balance) }}</span>
            </td>
            <td class="theme-table-cell-secondary">
              <span class="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                指标 #{{ trade.signalIndicatorId }}
              </span>
            </td>
            <td class="theme-table-cell-secondary">
              <span class="text-xs">{{ formatTime(trade.createdAt) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 交易统计摘要 -->
    <div v-if="trades.length > 0" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-sm theme-text-secondary">买入次数</div>
          <div class="text-lg font-semibold theme-text-primary">{{ buyTradesCount }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm theme-text-secondary">卖出次数</div>
          <div class="text-lg font-semibold theme-text-primary">{{ sellTradesCount }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm theme-text-secondary">总手续费</div>
          <div class="text-lg font-semibold theme-text-primary">{{ formatCurrency(totalFees) }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm theme-text-secondary">净盈亏</div>
          <div class="text-lg font-semibold" :class="getReturnClass(totalProfit)">
            {{ formatCurrency(totalProfit.toString()) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { formatTime, formatCurrency, formatPercent } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import type { BacktestResult, Trade } from '@/types'

interface Props {
  backtest: BacktestResult
  trades: Trade[]
  loading: boolean
}

const props = defineProps<Props>()
defineEmits<{
  refresh: []
}>()

// 格式化日期（只显示日期部分）
const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

// 格式化数量（保留适当的小数位）
const formatAmount = (amount: string) => {
  const num = parseFloat(amount)
  if (num >= 1) {
    return num.toFixed(4)
  } else {
    return num.toFixed(8)
  }
}

// 计算交易金额（价格 × 数量）
const calculateTradeValue = (trade: Trade) => {
  const price = parseFloat(trade.price)
  const amount = parseFloat(trade.amount)
  return (price * amount).toFixed(2)
}

// 交易类型样式
const getTradeTypeClass = (type: string) => {
  const classes = {
    buy: 'status-success',
    sell: 'status-danger'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// 格式化交易类型
const formatTradeType = (type: string) => {
  const types = {
    buy: '买入',
    sell: '卖出'
  }
  return types[type as keyof typeof types] || type
}

// 收益颜色样式
const getReturnClass = (value: number) => {
  if (value > 0) return 'return-positive'
  if (value < 0) return 'return-negative'
  return 'return-neutral'
}

// 计算统计数据
const buyTradesCount = computed(() => {
  return props.trades.filter(trade => trade.tradeType === 'buy').length
})

const sellTradesCount = computed(() => {
  return props.trades.filter(trade => trade.tradeType === 'sell').length
})

const totalFees = computed(() => {
  return props.trades.reduce((sum, trade) => sum + parseFloat(trade.fee), 0)
})

const totalProfit = computed(() => {
  return props.trades.reduce((sum, trade) => {
    const profit = parseFloat(trade.profit || '0')
    return sum + profit
  }, 0)
})
</script>