<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">交易条件</h3>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 入场条件 -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">入场条件</h4>
        <div v-if="!strategy.conditions?.entry?.length" class="text-center py-4">
          <EmptyState message="暂未配置入场条件" />
        </div>
        <div v-else class="space-y-2">
          <div 
            v-for="(condition, index) in strategy.conditions.entry" 
            :key="index"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ condition.indicator }}</span>
              <span class="text-gray-500 dark:text-gray-400">{{ condition.operator }}</span>
            </div>
            <div class="mt-1 text-gray-600 dark:text-gray-300">
              值: {{ condition.value }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 出场条件 -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-3">出场条件</h4>
        <div v-if="!strategy.conditions?.exit?.length" class="text-center py-4">
          <EmptyState message="暂未配置出场条件" />
        </div>
        <div v-else class="space-y-2">
          <div 
            v-for="(condition, index) in strategy.conditions.exit" 
            :key="index"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ condition.indicator }}</span>
              <span class="text-gray-500 dark:text-gray-400">{{ condition.operator }}</span>
            </div>
            <div class="mt-1 text-gray-600 dark:text-gray-300">
              值: {{ condition.value }}
            </div>
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