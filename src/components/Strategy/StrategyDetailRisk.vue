<template>
  <div class="theme-card p-6">
    <h3 class="section-title mb-4">风险管理</h3>
    
    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">买入手续费</dt>
        <dd class="mt-1 text-sm font-mono text-gray-900 dark:text-white">
          {{ formatPercent(strategy.buyFee, 4, true) }}
        </dd>
      </div>
      
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">卖出手续费</dt>
        <dd class="mt-1 text-sm font-mono text-gray-900 dark:text-white">
          {{ formatPercent(strategy.sellFee, 4, true) }}
        </dd>
      </div>
      
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">爆仓比例</dt>
        <dd class="mt-1 text-sm font-mono text-danger-600 dark:text-danger-400">
          {{ formatPercent(strategy.liquidationThreshold, 2, false) }}
        </dd>
      </div>
      
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">仓位类型</dt>
        <dd class="mt-1">
          <span :class="getPositionTypeClass(strategy.positionType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ formatPositionType(strategy.positionType) }}
          </span>
        </dd>
      </div>
      
      <div v-if="strategy.takeProfitRatio">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">止盈比例</dt>
        <dd class="mt-1 text-sm font-mono text-success-600 dark:text-success-400">
          {{ formatPercent(strategy.takeProfitRatio, 2, true) }}
        </dd>
      </div>
      
      <div v-if="strategy.stopLossRatio">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">止损比例</dt>
        <dd class="mt-1 text-sm font-mono text-danger-600 dark:text-danger-400">
          {{ formatPercent(strategy.stopLossRatio, 2, true) }}
        </dd>
      </div>
    </dl>
    
    <!-- 风险提示 -->
    <div class="mt-6 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h4 class="text-sm font-medium text-warning-800 dark:text-warning-200">
            风险提示
          </h4>
          <div class="mt-2 text-sm text-warning-700 dark:text-warning-300">
            <ul class="list-disc list-inside space-y-1">
              <li v-if="strategy.liquidationThreshold < 10">爆仓比例过低，存在本金损失风险</li>
              <li v-if="!strategy.stopLossRatio">未设置止损比例，建议添加止损保护</li>
              <li v-if="!strategy.takeProfitRatio">未设置止盈比例，建议添加止盈策略</li>
              <li v-if="strategy.buyFee + strategy.sellFee > 0.002">手续费成本较高，可能影响收益</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPercent } from '@/utils/format'
import type { Strategy } from '@/types'

interface Props {
  strategy: Strategy
}

defineProps<Props>()

const formatPositionType = (type: string) => {
  const types = {
    long: '做多',
    short: '做空',
    both: '双向'
  }
  return types[type as keyof typeof types] || type
}

const getPositionTypeClass = (type: string) => {
  const classes = {
    long: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    short: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    both: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
</script>