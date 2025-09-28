<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        指标计算
      </h3>
      <el-button 
        type="primary" 
        @click="$emit('calculate')"
        :loading="loading"
        :disabled="!canCalculate"
      >
        {{ loading ? '计算中...' : '计算指标' }}
      </el-button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <el-form-item label="交易对">
        <el-select 
          :model-value="selectedPairId" 
          @update:model-value="$emit('update:selectedPairId', $event)"
          placeholder="选择交易对"
          class="w-full"
        >
          <el-option
            v-for="pair in tradingPairs"
            :key="pair.id"
            :label="pair.symbol"
            :value="pair.id!"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="时间框架">
        <el-select 
          :model-value="selectedTimeframeId" 
          @update:model-value="$emit('update:selectedTimeframeId', $event)"
          placeholder="选择时间框架"
          class="w-full"
        >
          <el-option
            v-for="timeframe in timeframes"
            :key="timeframe.id"
            :label="timeframe.name"
            :value="timeframe.id!"
          />
        </el-select>
      </el-form-item>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <el-form-item label="开始时间">
        <el-date-picker
          :model-value="startTime"
          @update:model-value="$emit('update:startTime', $event)"
          type="datetime"
          placeholder="选择开始时间"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
          :model-value="endTime"
          @update:model-value="$emit('update:endTime', $event)"
          type="datetime"
          placeholder="选择结束时间"
          class="w-full"
        />
      </el-form-item>
    </div>

    <!-- 参数配置 -->
    <div v-if="indicator.parameters?.length" class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参数设置</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="param in indicator.parameters"
          :key="param.id"
          class="space-y-1"
        >
          <label class="block text-sm text-gray-600 dark:text-gray-400">
            {{ param.name }}
          </label>
          <el-input
            :model-value="getParameterValue(param.id!)"
            @input="(value: string) => updateParameterValue(param.id!, value)"
            :placeholder="param.defaultValue || `请输入${param.name}`"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Indicator, TradingPair, Timeframe } from '@/types'
import { computed } from 'vue'

interface Props {
  indicator: Indicator
  tradingPairs: TradingPair[]
  timeframes: Timeframe[]
  selectedPairId: number | null
  selectedTimeframeId: number | null
  startTime: Date | null
  endTime: Date | null
  loading: boolean
  parameterValues: Record<number, string>
}

interface Emits {
  (e: 'calculate'): void
  (e: 'update:selectedPairId', value: number): void
  (e: 'update:selectedTimeframeId', value: number): void
  (e: 'update:startTime', value: Date): void
  (e: 'update:endTime', value: Date): void
  (e: 'update:parameterValues', value: Record<number, string>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const canCalculate = computed(() => {
  return props.selectedPairId && props.selectedTimeframeId && props.startTime && props.endTime
})

const getParameterValue = (parameterId: number) => {
  return props.parameterValues[parameterId] || ''
}

const updateParameterValue = (parameterId: number, value: string) => {
  const newValues = { ...props.parameterValues }
  newValues[parameterId] = value
  emit('update:parameterValues', newValues)
}
</script>