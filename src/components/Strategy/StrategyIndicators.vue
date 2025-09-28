<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">指标配置</h3>
      <el-button type="primary" plain @click="addIndicator" :icon="Plus">
        {{ $t('strategies.addIndicator') }}
      </el-button>
    </div>

    <div v-if="form.indicators.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      暂未添加指标，请点击上方按钮添加
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(indicator, index) in form.indicators"
        :key="index"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            指标 {{ index + 1 }}
            <span v-if="indicator.id" class="text-xs text-gray-500">(ID: {{ indicator.id }})</span>
          </h4>
          <el-button
            size="small"
            type="danger"
            link
            @click="removeIndicator(index)"
          >
            移除
          </el-button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item
            :prop="`indicators.${index}.indicatorId`"
            :rules="[{ required: true, message: '请选择指标', trigger: 'change' }]"
            label="选择指标"
          >
            <el-select
              v-model="indicator.indicatorId"
              placeholder="选择指标"
              @change="handleIndicatorChange(index)"
              class="w-full"
            >
              <el-option
                v-for="ind in indicatorStore.indicators"
                :key="ind.id"
                :label="ind.name"
                :value="ind.id!"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="优先级">
            <el-input-number
              v-model="indicator.priority"
              :min="1"
              :max="100"
              class="w-full"
            />
          </el-form-item>
        </div>

        <!-- 参数配置 -->
        <div v-if="getIndicatorById(indicator.indicatorId)?.parameters?.length" class="mt-4">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参数配置</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="param in getIndicatorById(indicator.indicatorId)?.parameters || []"
              :key="param.id"
              class="space-y-1"
            >
              <label class="block text-sm text-gray-600 dark:text-gray-400">
                {{ param.name }}
              </label>
              <el-input
                :model-value="getParameterValue(index, param.id!)"
                @input="(value: string) => setParameterValue(index, param.id!, value)"
                :placeholder="param.defaultValue || `请输入${param.name}`"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIndicatorStore } from '@/stores/indicators'
import { Plus } from '@element-plus/icons-vue'
import type { CreateStrategyRequest, UpdateStrategyRequest } from '@/types'

interface Props {
  form: CreateStrategyRequest | UpdateStrategyRequest
}

const props = defineProps<Props>()
const indicatorStore = useIndicatorStore()

const getIndicatorById = (id: number) => {
  return indicatorStore.indicators.find(ind => ind.id === id)
}

const getParameterValue = (indicatorIndex: number, parameterId: number) => {
  const indicator = props.form.indicators[indicatorIndex]
  const param = indicator.parameters.find((p: any) => p.parameterId === parameterId)
  return param?.value || ''
}

const setParameterValue = (indicatorIndex: number, parameterId: number, value: string) => {
  const indicator = props.form.indicators[indicatorIndex]
  const param = indicator.parameters.find((p: any) => p.parameterId === parameterId)
  if (param) {
    param.value = value
  } else {
    indicator.parameters.push({ parameterId, value })
  }
}

const addIndicator = () => {
  props.form.indicators.push({
    indicatorId: 0,
    priority: 1,
    parameters: []
  })
}

const removeIndicator = (index: number) => {
  props.form.indicators.splice(index, 1)
}

const handleIndicatorChange = (index: number) => {
  const indicator = props.form.indicators[index]
  const selectedIndicator = getIndicatorById(indicator.indicatorId)
  
  if (selectedIndicator) {
    indicator.parameters = selectedIndicator.parameters.map(param => ({
      parameterId: param.id!,
      value: param.defaultValue || ''
    }))
  }
}
</script>