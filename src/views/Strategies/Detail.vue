<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          策略详情
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看策略配置和使用情况
        </p>
      </div>
      <div class="flex space-x-2">
        <router-link :to="`/strategies/edit/${strategy?.id}`">
          <el-button type="primary" :icon="Edit">
            编辑策略
          </el-button>
        </router-link>
        <router-link to="/strategies">
          <el-button :icon="ArrowLeft">
            {{ $t('common.back') }}
          </el-button>
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="strategy" class="space-y-6">
      <!-- 基本信息 -->
      <StrategyDetailInfo :strategy="strategy" />

      <!-- 使用的指标 -->
      <StrategyDetailIndicators :strategy="strategy" />

      <!-- 交易条件 -->
      <StrategyDetailConditions :strategy="strategy" />

      <!-- 回测历史 -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            回测历史
          </h3>
          <router-link :to="`/backtest/create?strategyId=${strategy.id}`">
            <el-button type="primary" size="small">
              创建回测
            </el-button>
          </router-link>
        </div>

        <div v-if="loadingBacktests" class="flex justify-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="!backtests.length" class="text-center py-8">
          <EmptyState title="暂无回测记录" description="该策略还没有进行过回测" />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  交易对
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  时间范围
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
              <tr v-for="backtest in backtests" :key="backtest.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getTradingPairSymbol(backtest.pairId) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatTime(backtest.startTime) }} - {{ formatTime(backtest.endTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getReturnRateClass(parseFloat(backtest.profitRate))">
                  {{ formatPercent(backtest.profitRate, 2, false) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(backtest.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatBacktestStatus(backtest.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatTime(backtest.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/backtest/${backtest.id}`">
                    <el-button type="primary" link size="small">
                      查看详情
                    </el-button>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <EmptyState title="策略不存在" description="找不到指定的策略" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStrategyStore } from '@/stores/strategies'
import { useIndicatorStore } from '@/stores/indicators'
import { useBacktestStore } from '@/stores/backtest'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime, formatPercent, formatPositionType, formatBacktestStatus } from '@/utils/format'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import StrategyDetailInfo from '@/components/Strategy/StrategyDetailInfo.vue'
import StrategyDetailRisk from '@/components/Strategy/StrategyDetailRisk.vue'
import StrategyDetailIndicators from '@/components/Strategy/StrategyDetailIndicators.vue'
import StrategyDetailConditions from '@/components/Strategy/StrategyDetailConditions.vue'
import type { Backtest } from '@/types'

const route = useRoute()
const strategyStore = useStrategyStore()
const indicatorStore = useIndicatorStore()
const backtestStore = useBacktestStore()
const priceDataStore = usePriceDataStore()

const loading = ref(true)
const loadingBacktests = ref(false)
const backtests = ref<Backtest[]>([])

const strategy = computed(() => {
  const id = Number(route.params.id)
  return strategyStore.strategies.find(s => s.id === id)
})



const getStatusClass = (status: string) => {
  const classes = {
    running: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    completed: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    failed: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getReturnRateClass = (rate: number | undefined) => {
  if (!rate) return 'text-gray-900 dark:text-white'
  if (rate > 0) return 'text-success-600 dark:text-success-400'
  if (rate < 0) return 'text-danger-600 dark:text-danger-400'
  return 'text-gray-900 dark:text-white'
}

const getTradingPairSymbol = (pairId: number) => {
  const pair = priceDataStore.tradingPairs?.find(p => p.id === pairId)
  return pair?.symbol || `交易对 #${pairId}`
}

const loadBacktests = async () => {
  if (!strategy.value) return
  
  loadingBacktests.value = true
  try {
    // 这里应该调用API获取该策略的回测记录
    // 暂时使用所有回测记录进行过滤
    await backtestStore.fetchBacktests()
    backtests.value = backtestStore.backtests.filter(b => b.strategyId === strategy.value!.id)
  } catch (error) {
    console.error('加载回测记录失败:', error)
  } finally {
    loadingBacktests.value = false
  }
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (!id || isNaN(id)) {
      console.error('无效的策略ID')
      return
    }
    
    // 并行加载数据
    await Promise.all([
      strategyStore.fetchStrategyWithDetails(id),
      indicatorStore.fetchIndicators(),
      priceDataStore.fetchTradingPairs(),
      loadBacktests()
    ])
  } catch (error) {
    console.error('加载策略详情失败:', error)
  } finally {
    loading.value = false
  }
})
</script>