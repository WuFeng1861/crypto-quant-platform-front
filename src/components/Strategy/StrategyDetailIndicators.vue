<template>
  <div class="theme-card p-6">
    <h3 class="section-title mb-4">使用的指标</h3>
    
    <div v-if="!strategy.indicators?.length" class="text-center py-8">
      <EmptyState 
        title="暂未配置指标" 
        description="该策略还没有添加任何技术指标"
        :icon="null"
      />
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="(indicator, index) in strategy.indicators" 
        :key="indicator.id || index"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
              {{ index + 1 }}
            </span>
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ getIndicatorName(indicator.indicatorId) }}
            </h4>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">优先级</span>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {{ indicator.priority }}
            </span>
          </div>
        </div>
        
        <div v-if="indicator.parameters?.length" class="space-y-2">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">参数配置</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div 
              v-for="param in indicator.parameters" 
              :key="param.id || param.parameterId"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
            >
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ getParameterName(param.parameterId) }}
              </div>
              <div class="text-sm font-mono text-gray-900 dark:text-white">
                {{ param.value }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-sm text-gray-500 dark:text-gray-400">
          使用默认参数
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIndicatorStore } from '@/stores/indicators'
import EmptyState from '@/components/Common/EmptyState.vue'
import type { StrategyWithDetails } from '@/types'

interface Props {
  strategy: StrategyWithDetails
}

const props = defineProps<Props>()
const indicatorStore = useIndicatorStore()

// 获取指标名称
const getIndicatorName = (indicatorId: number) => {
  const indicator = indicatorStore.indicators.find(ind => ind.id === indicatorId)
  return indicator?.name || `指标 #${indicatorId}`
}

// 获取参数名称
const getParameterName = (parameterId: number) => {
  // 这里可以根据参数ID获取参数名称
  // 暂时返回参数ID
  const paramNames: Record<number, string> = {
    1: '周期',
    2: '快线周期',
    3: '慢线周期',
    4: '信号线周期',
    5: '上轨倍数',
    6: '下轨倍数',
    7: 'K值',
    8: 'D值',
    9: 'J值',
    10: '超买线',
    11: '超卖线'
  }
  return paramNames[parameterId] || `参数${parameterId}`
}
</script>