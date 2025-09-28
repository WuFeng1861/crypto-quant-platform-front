<template>
  <div class="condition-group-help">
    <el-popover
      placement="top"
      :width="400"
      trigger="hover"
    >
      <template #reference>
        <el-icon class="text-blue-500 cursor-help ml-2">
          <QuestionFilled />
        </el-icon>
      </template>
      
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900 dark:text-white">{{ $t('conditionGroup.logicExplanation') }}</h4>
        
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p><strong>{{ $t('conditionGroup.groupRules') }}</strong></p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>{{ $t('conditionGroup.sameGroupAndLogic') }} <code class="bg-gray-100 px-1 rounded">AND</code> {{ $t('conditionGroup.logicConnect') }}</li>
            <li>{{ $t('conditionGroup.diffGroupOrLogic') }} <code class="bg-gray-100 px-1 rounded">OR</code> {{ $t('conditionGroup.logicConnect') }}</li>
            <li>{{ $t('conditionGroup.defaultGroup') }}</li>
          </ul>
          
          <p><strong>{{ $t('common.example') }}</strong></p>
          <div class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
            <p>{{ $t('conditionGroup.condition1') }}: RSI > 50</p>
            <p>{{ $t('conditionGroup.condition2') }}: MACD > 0</p>
            <p>{{ $t('conditionGroup.condition3') }}: {{$t('common.price')}} > MA20</p>
            <p class="mt-2 font-medium">{{ $t('common.logic') }}: (RSI > 50 AND MACD > 0) OR {{$t('common.price')}} > MA20</p>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
</script>

<style scoped>
code {
  @apply bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs;
}
</style>