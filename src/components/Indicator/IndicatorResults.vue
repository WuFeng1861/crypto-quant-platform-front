<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ $t('indicator.calculationResults') }}
    </h3>

    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="!results?.length" class="text-center py-8">
      <EmptyState :message="$t('indicator.noCalculationResults')" />
    </div>

    <div v-else>
      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('indicator.dataPoints') }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ results.length }}</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('common.maxValue') }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(maxValue) }}</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('common.minValue') }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(minValue) }}</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('common.averageValue') }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(avgValue) }}</div>
        </div>
      </div>

      <!-- 图表 -->
      <div class="mb-6">
        <IndicatorChart :data="results" :indicator-name="indicatorName" />
      </div>

      <!-- 数据表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.time') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('indicator.indicatorValue') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="result in paginatedResults" :key="result.timestamp">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatTime(result.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatNumber(result.value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="results.length > pageSize" class="mt-4 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="results.length"
          layout="prev, pager, next"
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatTime, formatNumber } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import IndicatorChart from '@/components/Common/IndicatorChart.vue'
import { useI18n } from 'vue-i18n'

interface IndicatorResult {
  timestamp: string
  value: number
}

interface Props {
  results: IndicatorResult[]
  loading: boolean
  indicatorName: string
}

const props = defineProps<Props>()

const { t: $t } = useI18n()

const currentPage = ref(1)
const pageSize = 50

const maxValue = computed(() => {
  if (!props.results?.length) return 0
  return Math.max(...props.results.map(r => r.value))
})

const minValue = computed(() => {
  if (!props.results?.length) return 0
  return Math.min(...props.results.map(r => r.value))
})

const avgValue = computed(() => {
  if (!props.results?.length) return 0
  const sum = props.results.reduce((acc, r) => acc + r.value, 0)
  return sum / props.results.length
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return props.results.slice(start, end)
})
</script>