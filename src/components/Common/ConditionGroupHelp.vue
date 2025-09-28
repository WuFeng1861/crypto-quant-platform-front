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
        <h4 class="font-medium text-gray-900 dark:text-white">条件分组逻辑说明</h4>
        
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p><strong>分组规则：</strong></p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>同一组内的条件使用 <code class="bg-gray-100 px-1 rounded">AND</code> 逻辑连接</li>
            <li>不同组之间使用 <code class="bg-gray-100 px-1 rounded">OR</code> 逻辑连接</li>
            <li>默认分组为 1</li>
          </ul>
          
          <p><strong>示例：</strong></p>
          <div class="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
            <p>条件1 (组1): RSI > 50</p>
            <p>条件2 (组1): MACD > 0</p>
            <p>条件3 (组2): 价格 > MA20</p>
            <p class="mt-2 font-medium">逻辑: (RSI > 50 AND MACD > 0) OR 价格 > MA20</p>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
code {
  @apply bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs;
}
</style>