<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">使用的指标</h3>
    
    <div v-if="!strategy.indicators?.length" class="text-center py-8">
      <EmptyState message="暂未配置指标" />
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="indicator in strategy.indicators" 
        :key="indicator.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium text-gray-900 dark:text-white">{{ indicator.name }}</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ indicator.type }}</span>
        </div>
        
        <div v-if="indicator.parameters" class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div v-for="(value, key) in indicator.parameters" :key="key">
            <span class="text-gray-500 dark:text-gray-400">{{ key }}:</span>
            <span class="ml-1 text-gray-900 dark:text-white">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@/components/Common/EmptyState.vue'
import type { Strategy } from '@/types'

interface Props {
  strategy: Strategy
}

defineProps<Props>()
</script>