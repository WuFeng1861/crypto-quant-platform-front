<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ $t('indicators.parameterSettings') }}
    </h3>
    
    <div v-if="!indicator.parameters?.length" class="text-center py-8">
      <EmptyState :message="$t('indicator.noConfigurableParameters')" />
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="param in indicator.parameters"
        :key="param.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ param.name }}</h4>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ param.type }}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">{{ $t('common.defaultValue') }}:</span>
            <span class="ml-1 text-gray-900 dark:text-white">{{ param.defaultValue || '-' }}</span>
          </div>
          <div v-if="param.minValue !== undefined">
            <span class="text-gray-500 dark:text-gray-400">{{ $t('common.minValue') }}:</span>
            <span class="ml-1 text-gray-900 dark:text-white">{{ param.minValue }}</span>
          </div>
          <div v-if="param.maxValue !== undefined">
            <span class="text-gray-500 dark:text-gray-400">{{ $t('common.maxValue') }}:</span>
            <span class="ml-1 text-gray-900 dark:text-white">{{ param.maxValue }}</span>
          </div>
        </div>
        
        <div v-if="param.description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ param.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@/components/Common/EmptyState.vue'
import type { Indicator } from '@/types'
import { useI18n } from 'vue-i18n'

interface Props {
  indicator: Indicator
}

const props = defineProps<Props>()

const { t: $t } = useI18n()
</script>