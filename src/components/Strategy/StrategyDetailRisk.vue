<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">风险管理</h3>
    
    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">止损</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
          {{ strategy.stopLoss ? formatPercent(strategy.stopLoss, 2, false) : '-' }}
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">止盈</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
          {{ strategy.takeProfit ? formatPercent(strategy.takeProfit, 2, false) : '-' }}
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">仓位大小</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
          {{ strategy.positionSize ? formatPercent(strategy.positionSize, 2, false) : '-' }}
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">最大仓位数</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.maxPositions || '-' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatPercent } from '@/utils/format'
import type { Strategy } from '@/types'

interface Props {
  strategy: Strategy
}

defineProps<Props>()
</script>