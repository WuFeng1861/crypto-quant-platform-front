<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">基本信息</h3>
    
    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">策略名称</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.name }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">仓位类型</dt>
        <dd class="mt-1">
          <span :class="getPositionTypeClass(strategy.positionType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ formatPositionType(strategy.positionType) }}
          </span>
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">创建时间</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(strategy.createdAt!) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">更新时间</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(strategy.updatedAt!) }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">状态</dt>
        <dd class="mt-1">
          <!-- <span :class="getStatusClass(strategy.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {{ formatStrategyStatus(strategy.status) }}
          </span> -->
        </dd>
      </div>
      <div class="md:col-span-2 lg:col-span-3">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">描述</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.description || '-' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils/format'
import type { Strategy } from '@/types'

interface Props {
  strategy: Strategy
}

defineProps<Props>()

const getPositionTypeClass = (type: string) => {
  const classes = {
    long: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    short: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    both: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatPositionType = (type: string) => {
  const types = {
    long: '做多',
    short: '做空',
    both: '双向'
  }
  return types[type as keyof typeof types] || type
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    draft: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}
</script>