<template>
  <div class="theme-card p-6">
    <h3 class="section-title mb-4">交易条件</h3>
    
    <div v-if="!strategy.conditions?.length" class="text-center py-8">
      <EmptyState 
        title="暂未配置交易条件" 
        description="该策略还没有设置任何交易条件"
        :icon="null"
      />
    </div>
    
    <div v-else class="space-y-6">
      <!-- 按动作分组显示条件 -->
      <div v-for="(group, action) in groupedConditions" :key="action" class="space-y-3">
        <div class="flex items-center space-x-2">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ getActionLabel(action) }}
          </h4>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {{ group.length }} 个条件
          </span>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div 
            v-for="(condition, index) in group" 
            :key="condition.id || index"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span :class="getActionClass(condition.action)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  {{ getActionLabel(condition.action) }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">优先级 {{ condition.priority }}</span>
              </div>
              <span :class="getConditionTypeClass(condition.conditionType)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                {{ getConditionTypeLabel(condition.conditionType) }}
              </span>
            </div>
            
            <!-- 标准条件 -->
            <div v-if="condition.conditionType !== 'custom'" class="space-y-2">
              <!-- 指标信息 -->
              <div v-if="condition.indicatorIndex !== undefined" class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">使用指标:</span>
                <span class="ml-2 font-medium text-blue-600 dark:text-blue-400">
                  指标 #{{ condition.indicatorIndex }}
                  <span v-if="getIndicatorName(condition.indicatorIndex)" class="text-gray-600 dark:text-gray-300">
                    ({{ getIndicatorName(condition.indicatorIndex) }})
                  </span>
                </span>
              </div>
              
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">指标路径:</span>
                <span class="ml-2 font-mono text-gray-900 dark:text-white">{{ condition.currentValuePath }}</span>
              </div>
              
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">操作符:</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ getOperatorLabel(condition.operator) }}</span>
              </div>
              
              <!-- 比较类型和值 -->
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">比较类型:</span>
                <span class="ml-2 font-medium" :class="condition.comparisonType === 'constant' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'">
                  {{ condition.comparisonType === 'constant' ? '固定值' : '指标值' }}
                </span>
              </div>
              
              <div class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">比较值:</span>
                <span class="ml-2 font-mono text-gray-900 dark:text-white">
                  <template v-if="condition.comparisonType === 'constant'">
                    {{ condition.constantValue }}
                  </template>
                  <template v-else>
                    <span v-if="condition.comparedIndicatorIndex !== undefined" class="text-purple-600 dark:text-purple-400">
                      指标 #{{ condition.comparedIndicatorIndex }}
                      <span v-if="getIndicatorName(condition.comparedIndicatorIndex)" class="text-gray-600 dark:text-gray-300">
                        ({{ getIndicatorName(condition.comparedIndicatorIndex) }})
                      </span>
                    </span>
                    <span class="block mt-1">{{ condition.comparedValuePath }}</span>
                  </template>
                </span>
              </div>
              
              <div v-if="condition.group" class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">条件组:</span>
                <span class="ml-2 text-gray-900 dark:text-white">组 {{ condition.group }}</span>
              </div>
              
              <!-- 时间信息 -->
              <div v-if="condition.createdAt || condition.updatedAt" class="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div v-if="condition.createdAt">
                  创建: {{ formatDate(condition.createdAt) }}
                </div>
                <div v-if="condition.updatedAt && condition.updatedAt !== condition.createdAt">
                  更新: {{ formatDate(condition.updatedAt) }}
                </div>
              </div>
            </div>
            
            <!-- 自定义代码条件 -->
            <div v-else class="space-y-2">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">自定义代码:</div>
              <div class="bg-gray-900 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto">
                <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{ condition.customCode || '// 暂无代码' }}</pre>
              </div>
              
              <!-- 自定义条件的时间信息 -->
              <div v-if="condition.createdAt || condition.updatedAt" class="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div v-if="condition.createdAt">
                  创建: {{ formatDate(condition.createdAt) }}
                </div>
                <div v-if="condition.updatedAt && condition.updatedAt !== condition.createdAt">
                  更新: {{ formatDate(condition.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import type { StrategyWithDetails, StrategyCondition } from '@/types'

interface Props {
  strategy: StrategyWithDetails
}

const props = defineProps<Props>()

// 按动作分组条件
const groupedConditions = computed(() => {
  if (!props.strategy.conditions) return {}
  
  return props.strategy.conditions.reduce((groups, condition) => {
    const action = condition.action
    if (!groups[action]) {
      groups[action] = []
    }
    groups[action].push(condition)
    return groups
  }, {} as Record<string, StrategyCondition[]>)
})

// 获取动作标签
const getActionLabel = (action: string) => {
  const labels = {
    buy: '买入条件',
    sell: '卖出条件',
    none: '无动作条件'
  }
  return labels[action as keyof typeof labels] || action
}

// 获取动作样式类
const getActionClass = (action: string) => {
  const classes = {
    buy: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    sell: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    none: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[action as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

// 获取条件类型标签
const getConditionTypeLabel = (type: string) => {
  const labels = {
    value: '数值条件',
    crossover: '交叉条件',
    custom: '自定义代码'
  }
  return labels[type as keyof typeof labels] || type
}

// 获取条件类型样式类
const getConditionTypeClass = (type: string) => {
  const classes = {
    value: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    crossover: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    custom: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

// 获取操作符标签
const getOperatorLabel = (operator: string) => {
  const labels = {
    '>': '大于 (>)',
    '<': '小于 (<)',
    '>=': '大于等于 (>=)',
    '<=': '小于等于 (<=)',
    '==': '等于 (==)',
    '!=': '不等于 (!=)'
  }
  return labels[operator as keyof typeof labels] || operator
}

// 获取指标名称
const getIndicatorName = (indicatorIndex: number) => {
  if (!props.strategy.indicators || indicatorIndex >= props.strategy.indicators.length) {
    return null
  }
  const indicator = props.strategy.indicators[indicatorIndex]
  return indicator?.name || `指标${indicatorIndex}`
}

// 格式化日期
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>