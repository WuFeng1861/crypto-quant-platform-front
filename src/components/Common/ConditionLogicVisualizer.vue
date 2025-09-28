<template>
  <div class="condition-logic-visualizer">
    <div v-if="showExample" class="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">{{ $t('conditionLogic.exampleTitle') }}</h4>
      <div class="space-y-2 text-sm">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{{ $t('conditionLogic.group1') }}</span>
          <span>{{ $t('conditionLogic.conditionA') }} AND {{ $t('conditionLogic.conditionB') }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-gray-500">OR</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{{ $t('conditionLogic.group2') }}</span>
          <span>{{ $t('conditionLogic.conditionC') }} AND {{ $t('conditionLogic.conditionD') }}</span>
        </div>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {{ $t('common.result') }}：( {{ $t('conditionLogic.conditionA') }} AND {{ $t('conditionLogic.conditionB') }} ) OR ( {{ $t('conditionLogic.conditionC') }} AND {{ $t('conditionLogic.conditionD') }} )
        </div>
      </div>
    </div>

    <div v-if="conditions.length > 0" class="space-y-3">
      <div v-for="(group, groupIndex) in groupedConditions" :key="groupIndex" class="condition-group">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <span 
              class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
              :class="getGroupColor(group.groupNumber)"
            >
              {{ group.groupNumber }}
            </span>
          </div>
          
          <div class="flex-1 space-y-2">
            <div v-for="(condition, conditionIndex) in group.conditions" :key="conditionIndex">
              <div class="flex items-center space-x-2 text-sm">
                <span v-if="conditionIndex > 0" class="text-gray-500 font-medium">AND</span>
                <div class="flex-1 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="font-medium">条件 {{ getConditionIndex(condition) + 1 }}:</span>
                      <span class="text-gray-600 dark:text-gray-400">
                        {{ getConditionDescription(condition) }}
                      </span>
                    </div>
                    <el-tag 
                      :type="condition.action === 'buy' ? 'success' : condition.action === 'sell' ? 'danger' : 'info'"
                      size="small"
                    >
                      {{ getActionText(condition.action) }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="groupIndex < groupedConditions.length - 1" class="flex justify-center my-3">
          <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            OR
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ $t('conditionLogic.noConditions') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StrategyCondition } from '@/types'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

interface Props {
  conditions: StrategyCondition[]
  showExample?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showExample: true
})

const groupedConditions = computed(() => {
  const groups = new Map<number, StrategyCondition[]>()
  
  props.conditions.forEach(condition => {
    const groupNumber = condition.group || 1
    if (!groups.has(groupNumber)) {
      groups.set(groupNumber, [])
    }
    groups.get(groupNumber)!.push(condition)
  })
  
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([groupNumber, conditions]) => ({
      groupNumber,
      conditions: conditions.sort((a, b) => (a.priority || 1) - (b.priority || 1))
    }))
})

const getConditionIndex = (condition: StrategyCondition) => {
  return props.conditions.findIndex(c => c === condition)
}

const getConditionDescription = (condition: StrategyCondition) => {
  const parts = []
  
  if (condition.indicatorIndex !== undefined) {
    parts.push(`${$t('common.indicator')}${condition.indicatorIndex + 1}`)
  }
  
  if (condition.currentValuePath) {
    parts.push(condition.currentValuePath)
  }
  
  parts.push(condition.operator)
  
  if (condition.comparisonType === 'constant' && condition.constantValue) {
    parts.push(condition.constantValue)
  } else if (condition.comparisonType === 'indicator' && condition.comparedIndicatorIndex !== undefined) {
    parts.push(`${$t('common.indicator')}${condition.comparedIndicatorIndex + 1}`)
    if (condition.comparedValuePath) {
      parts.push(condition.comparedValuePath)
    }
  }
  
  return parts.join(' ')
}

const getActionText = (action: string) => {
  switch (action) {
    case 'buy': return $t('common.buy')
    case 'sell': return $t('common.sell')
    case 'none': return $t('common.noOperation')
    default: return action
  }
}

const getGroupColor = (groupNumber: number) => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-red-100 text-red-800',
    'bg-gray-100 text-gray-800'
  ]
  return colors[(groupNumber - 1) % colors.length]
}
</script>

<style scoped>
.condition-logic-visualizer {
  /* 自定义样式 */
}

.condition-group {
  position: relative;
}
</style>