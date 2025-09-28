<template>
  <div class="mb-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ $t('strategies.riskManagement') }}</h3>
    
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

      <el-form-item :label="$t('strategies.takeProfitRatioLabel')" prop="takeProfitRatio">
        <el-input-number
          v-model="form.takeProfitRatio"
          :min="100"
          :max="1000"
          :step="1"
          :precision="0"
          :placeholder="$t('strategies.takeProfitRatioPlaceholder')"
          class="w-full"
        />
        <div class="text-xs text-gray-500 mt-1">{{ $t('strategies.takeProfitRatioTip') }}</div>
      </el-form-item>

      <el-form-item :label="$t('strategies.stopLossRatioLabel')" prop="stopLossRatio">
        <el-input-number
          v-model="form.stopLossRatio"
          :min="1"
          :max="99"
          :step="1"
          :precision="0"
          :placeholder="$t('strategies.stopLossRatioPlaceholder')"
          class="w-full"
        />
        <div class="text-xs text-gray-500 mt-1">{{ $t('strategies.stopLossRatioTip') }}</div>
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