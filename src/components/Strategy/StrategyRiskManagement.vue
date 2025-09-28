<template>
  <div class="mb-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">风险管理</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <el-form-item :label="$t('strategies.buyFee')" prop="buyFee">
        <el-input-number
          v-model="form.buyFee"
          :min="0"
          :max="1"
          :step="0.000001"
          :precision="6"
          class="w-full"
        />
      </el-form-item>

      <el-form-item :label="$t('strategies.sellFee')" prop="sellFee">
        <el-input-number
          v-model="form.sellFee"
          :min="0"
          :max="1"
          :step="0.000001"
          :precision="6"
          class="w-full"
        />
      </el-form-item>

      <el-form-item :label="$t('strategies.liquidationThreshold')" prop="liquidationThreshold">
        <el-input-number
          v-model="form.liquidationThreshold"
          :min="0"
          :max="100"
          :step="1"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="止盈比例 (%)" prop="takeProfitRatio">
        <el-input-number
          v-model="form.takeProfitRatio"
          :min="100"
          :max="1000"
          :step="1"
          :precision="0"
          placeholder="可选，大于100"
          class="w-full"
        />
        <div class="text-xs text-gray-500 mt-1">可选配置，设置后当盈利达到该比例时自动止盈</div>
      </el-form-item>

      <el-form-item label="止损比例 (%)" prop="stopLossRatio">
        <el-input-number
          v-model="form.stopLossRatio"
          :min="1"
          :max="99"
          :step="1"
          :precision="0"
          placeholder="可选，0-100之间"
          class="w-full"
        />
        <div class="text-xs text-gray-500 mt-1">可选配置，设置后当亏损达到该比例时自动止损</div>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateStrategyRequest, UpdateStrategyRequest } from '@/types'

interface Props {
  form: CreateStrategyRequest | UpdateStrategyRequest
}

defineProps<Props>()
</script>