<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      基本信息
    </h3>
    <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">名称</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ indicator.name }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">创建时间</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(indicator.createdAt!) }}</dd>
      </div>
      <div class="md:col-span-2">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">描述</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ indicator.description || '-' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils/format'
import type { Indicator } from '@/types'

interface Props {
  indicator: Indicator
}

defineProps<Props>()
</script>