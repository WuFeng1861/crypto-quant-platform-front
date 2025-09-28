<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('backtest.title') }}
        </h1>
        <p class="page-subtitle">
          管理和创建回测任务
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
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable class="w-32">
          <el-option label="全部" value="" />
          <el-option label="运行中" value="running" />
          <el-option label="已完成" value="completed" />
          <el-option label="失败" value="failed" />
        </el-select>
        <el-button @click="resetFilters">
          {{ $t('common.reset') }}
        </el-button>
        <el-button @click="refreshData" :icon="Refresh">
          刷新
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
          title="暂无回测记录"
          description="开始创建您的第一个回测任务"
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
                时间范围
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                初始资金
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
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
                <div>{{ formatTime(backtest.startTime, 'MM-DD') }}</div>
                <div>{{ formatTime(backtest.endTime, 'MM-DD') }}</div>
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
                    查看
                  </el-button>
                </router-link>
                <el-button
                  v-if="backtest.status !== 'running'"
                  size="small"
                  type="danger"
                  link
                  @click="handleDelete(backtest)"
                >
                  删除
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
  return strategy?.name || `策略 #${strategyId}`
}

const getTradingPairSymbol = (pairId: number) => {
  const pair = priceDataStore.tradingPairs?.find(p => p.id === pairId)
  return pair?.symbol || `交易对 #${pairId}`
}

const handleDelete = async (backtest: BacktestResult) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除回测记录吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await backtestStore.deleteBacktest(backtest.id)
    ElMessage.success('回测记录删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
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
  
  // 每30秒自动刷新一次，以更新运行中的回测状态
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