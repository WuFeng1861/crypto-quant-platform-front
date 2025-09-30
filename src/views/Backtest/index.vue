<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('backtest.title') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('backtest.subtitle') }}
        </p>
      </div>
      <router-link to="/backtest/create">
        <el-button type="primary" :icon="Plus">
          {{ $t('backtest.create') }}
        </el-button>
      </router-link>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <el-input
            v-model="searchQuery"
            :placeholder="$t('common.search')"
            :prefix-icon="Search"
            clearable
          />
        </div>
        <el-select v-model="statusFilter" :placeholder="$t('common.statusFilter')" clearable class="w-32">
          <el-option :label="$t('common.all')" value="" />
          <el-option :label="$t('backtest.status.running')" value="running" />
          <el-option :label="$t('backtest.status.completed')" value="completed" />
          <el-option :label="$t('backtest.status.failed')" value="failed" />
        </el-select>
        <el-button @click="resetFilters">
          {{ $t('common.reset') }}
        </el-button>
        <el-button @click="refreshData" :icon="Refresh">
          {{ $t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- 回测列表 -->
    <div class="card">
      <div v-if="backtestStore.loading" class="p-6">
        <LoadingSpinner />
      </div>

      <div v-else-if="!filteredBacktests || filteredBacktests.length === 0" class="p-6">
        <EmptyState
          :title="$t('backtest.noDataTitle')"
          :description="$t('backtest.noDataDescription')"
          :action-text="$t('backtest.noDataAction')"
          @action="$router.push('/backtest/create')"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('strategies.title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('tradingPairs.title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('backtest.timeRange') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('backtest.initialCapital') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('dashboard.returnRate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.createdAt') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="backtest in filteredBacktests" :key="backtest.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ getStrategyName(backtest.strategyId) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getTradingPairSymbol(backtest.pairId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div>{{ formatTime(backtest.startTime, 'YYYY-MM-DD') }}</div>
                <div>{{ formatTime(backtest.endTime, 'YYYY-MM-DD') }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatCurrency(backtest.initialCapital) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getProfitRateClass(backtest.profitRate)">
                {{ backtest.status === 'completed' ? formatPercent(backtest.profitRate, 2, false) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(backtest.status)">
                  {{ formatBacktestStatus(backtest.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(backtest.createdAt, 'MM-DD HH:mm') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <router-link :to="`/backtest/${backtest.id}`">
                  <el-button size="small" type="primary" link>
                    {{ $t('common.view') }}
                  </el-button>
                </router-link>
                <el-button
                  v-if="backtest.status !== 'running'"
                  size="small"
                  type="danger"
                  link
                  @click="handleDelete(backtest)"
                >
                  {{ $t('common.delete') }}
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useBacktestStore } from '@/stores/backtest'
import { useStrategyStore } from '@/stores/strategies'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime, formatPercent, formatCurrency, formatBacktestStatus } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import type { BacktestResult } from '@/types'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const backtestStore = useBacktestStore()
const strategyStore = useStrategyStore()
const priceDataStore = usePriceDataStore()

const searchQuery = ref('')
const statusFilter = ref('')
let refreshInterval: NodeJS.Timeout | null = null

const filteredBacktests = computed(() => {
  let backtests = backtestStore.backtests
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    backtests = backtests.filter(backtest => {
      const strategyName = getStrategyName(backtest.strategyId).toLowerCase()
      const pairSymbol = getTradingPairSymbol(backtest.pairId).toLowerCase()
      return strategyName.includes(query) || pairSymbol.includes(query)
    })
  }
  
  if (statusFilter.value) {
    backtests = backtests.filter(backtest => backtest.status === statusFilter.value)
  }
  
  return backtests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const refreshData = () => {
  backtestStore.fetchBacktests()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getReturnRateClass = (returnRate: number) => {
  if (returnRate > 0) {
    return 'text-success-600'
  } else if (returnRate < 0) {
    return 'text-danger-600'
  }
  return 'text-gray-500 dark:text-gray-400'
}

const getProfitRateClass = (profitRate: string) => {
  const rate = parseFloat(profitRate)
  if (rate > 0) {
    return 'text-success-600'
  } else if (rate < 0) {
    return 'text-danger-600'
  }
  return 'text-gray-500 dark:text-gray-400'
}

const getStrategyName = (strategyId: number) => {
  const strategy = strategyStore.strategies?.find(s => s.id === strategyId)
  return strategy?.name || `${$t('strategies.title')} #${strategyId}`
}

const getTradingPairSymbol = (pairId: number) => {
  const pair = priceDataStore.tradingPairs?.find(p => p.id === pairId)
  return pair?.symbol || `${$t('tradingPairs.title')} #${pairId}`
}

const handleDelete = async (backtest: BacktestResult) => {
  try {
    await ElMessageBox.confirm(
      $t('backtest.confirmDeleteMessage'),
      $t('common.confirmDelete'),
      {
        confirmButtonText: $t('common.delete'),
        cancelButtonText: $t('common.cancel'),
        type: 'warning'
      }
    )
    
    await backtestStore.deleteBacktest(backtest.id)
    ElMessage.success($t('backtest.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error($t('backtest.deleteFailed'))
    }
  }
}

onMounted(async () => {
  // 加载基础数据
  await Promise.all([
    backtestStore.fetchBacktests(),
    strategyStore.fetchStrategies(),
    priceDataStore.fetchTradingPairs()
  ])
  
  // Auto refresh every 30 seconds to update running backtest status
  refreshInterval = setInterval(() => {
    if (backtestStore.runningBacktestsList?.length > 0) {
      backtestStore.fetchBacktests()
    }
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>