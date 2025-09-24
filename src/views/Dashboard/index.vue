<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DataAnalysis class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('indicators.title') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ indicatorStore.indicators?.length || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <TrendCharts class="h-8 w-8 text-success-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('strategies.title') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ strategyStore.strategies?.length || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Timer class="h-8 w-8 text-warning-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('backtest.title') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ backtestStore.backtests?.length || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Monitor class="h-8 w-8 text-danger-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              运行中回测
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ backtestStore.runningBacktestsList?.length || 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        快速操作
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/indicators/create"
          class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <Plus class="h-6 w-6 text-gray-400 group-hover:text-primary-500 mr-3" />
          <span class="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            创建指标
          </span>
        </router-link>

        <router-link
          to="/strategies/create"
          class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <Plus class="h-6 w-6 text-gray-400 group-hover:text-primary-500 mr-3" />
          <span class="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            创建策略
          </span>
        </router-link>

        <router-link
          to="/backtest/create"
          class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <Plus class="h-6 w-6 text-gray-400 group-hover:text-primary-500 mr-3" />
          <span class="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            创建回测
          </span>
        </router-link>

        <router-link
          to="/trading-pairs"
          class="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
        >
          <Setting class="h-6 w-6 text-gray-400 group-hover:text-primary-500 mr-3" />
          <span class="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            管理交易对
          </span>
        </router-link>
      </div>
    </div>

    <!-- 最近的回测结果 -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          最近回测结果
        </h3>
        <router-link
          to="/backtest"
          class="text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          查看全部
        </router-link>
      </div>

      <div v-if="backtestStore.loading">
        <LoadingSpinner />
      </div>

      <div v-else-if="recentBacktests.length === 0">
        <EmptyState
          title="暂无回测记录"
          description="开始创建您的第一个回测"
          action-text="创建回测"
          @action="$router.push('/backtest/create')"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                策略
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                交易对
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                收益率
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                创建时间
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="backtest in recentBacktests" :key="backtest.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ getStrategyName(backtest.strategyId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getTradingPairSymbol(backtest.pairId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="parseFloat(backtest.profitRate) >= 0 ? 'text-success-600' : 'text-danger-600'">
                {{ formatPercent(backtest.profitRate, 2, false) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(backtest.status)">
                  {{ formatBacktestStatus(backtest.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(backtest.createdAt, 'MM-DD HH:mm') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useIndicatorStore } from '@/stores/indicators'
import { useStrategyStore } from '@/stores/strategies'
import { useBacktestStore } from '@/stores/backtest'
import { usePriceDataStore } from '@/stores/priceData'
import { formatPercent, formatTime, formatBacktestStatus } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import {
  DataAnalysis,
  TrendCharts,
  Timer,
  Monitor,
  Plus,
  Setting
} from '@element-plus/icons-vue'

const indicatorStore = useIndicatorStore()
const strategyStore = useStrategyStore()
const backtestStore = useBacktestStore()
const priceDataStore = usePriceDataStore()

const recentBacktests = computed(() => {
  if (!backtestStore.backtests || !Array.isArray(backtestStore.backtests)) {
    return []
  }
  return backtestStore.backtests
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

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

const getStrategyName = (strategyId: number) => {
  const strategy = strategyStore.strategies?.find(s => s.id === strategyId)
  return strategy?.name || `策略 #${strategyId}`
}

const getTradingPairSymbol = (pairId: number) => {
  const pair = priceDataStore.tradingPairs?.find(p => p.id === pairId)
  return pair?.symbol || `交易对 #${pairId}`
}

onMounted(async () => {
  // 加载基础数据
  await Promise.all([
    indicatorStore.fetchIndicators(),
    strategyStore.fetchStrategies(),
    backtestStore.fetchBacktests(),
    priceDataStore.fetchTradingPairs()
  ])
})
</script>