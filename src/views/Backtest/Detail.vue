<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          回测详情
        </h1>
        <p class="page-subtitle">
          查看回测结果和交易记录
        </p>
      </div>
      <router-link to="/backtest">
        <el-button :icon="ArrowLeft">
          {{ $t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="backtest" class="space-y-6">
      <!-- 基本信息 -->
      <BacktestBasicInfo :backtest="backtest" />

      <!-- 已完成的回测显示详细信息 -->
      <template v-if="backtest.status === 'completed'">
        <!-- 收益指标 -->
        <BacktestMetrics :backtest="backtest" />

        <!-- 交易统计 -->
        <BacktestTradingStats :backtest="backtest" />

        <!-- 收益曲线图 -->
        <div class="card p-6">
          <ProfitChart 
            :trades="trades" 
            :initial-capital="parseFloat(backtest.initialCapital)"
            :loading="loadingTrades"
          />
        </div>

        <!-- 交易记录 -->
        <BacktestTradesList 
          :backtest="backtest" 
          :trades="trades" 
          :loading="loadingTrades"
          @refresh="loadTrades"
        />
      </template>

      <!-- 运行中状态 -->
      <div v-else-if="backtest.status === 'running'" class="card p-6 text-center">
        <LoadingSpinner />
        <p class="mt-4 text-gray-600 dark:text-gray-400">回测正在执行中，请稍候...</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
          预计完成时间: {{ estimatedCompletionTime }}
        </p>
      </div>

      <!-- 失败状态 -->
      <div v-else-if="backtest.status === 'failed'" class="card p-6 text-center">
        <div class="text-danger-600 dark:text-danger-400">
          <p class="text-lg font-medium">回测执行失败</p>
          <p class="mt-2 text-sm">{{ backtest.earlyStopReason || '未知错误' }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <EmptyState message="回测不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBacktestStore } from '@/stores/backtest'
import { useStrategyStore } from '@/stores/strategies'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime, formatCurrency, formatPercent, formatBacktestStatus } from '@/utils/format'
import { ArrowLeft } from '@element-plus/icons-vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import ProfitChart from '@/components/Common/ProfitChart.vue'
import BacktestBasicInfo from '@/components/Backtest/BacktestBasicInfo.vue'
import BacktestMetrics from '@/components/Backtest/BacktestMetrics.vue'
import BacktestTradingStats from '@/components/Backtest/BacktestTradingStats.vue'
import BacktestTradesList from '@/components/Backtest/BacktestTradesList.vue'
import type { Trade } from '@/types'

const route = useRoute()
const backtestStore = useBacktestStore()
const strategyStore = useStrategyStore()
const priceDataStore = usePriceDataStore()

const loading = ref(true)
const loadingTrades = ref(false)
const trades = ref<Trade[]>([])
let statusCheckInterval: NodeJS.Timeout | null = null

const backtest = computed(() => {
  const id = Number(route.params.id)
  return backtestStore.backtests.find(b => b.id === id)
})

const estimatedCompletionTime = computed(() => {
  // 简单的估算逻辑
  return '约5-10分钟'
})



const loadTrades = async () => {
  if (!backtest.value) return
  
  loadingTrades.value = true
  try {
    await backtestStore.fetchTrades(backtest.value.id!)
    trades.value = backtestStore.currentTrades
  } catch (error) {
    console.error('加载交易记录失败:', error)
  } finally {
    loadingTrades.value = false
  }
}

const checkStatus = async () => {
  if (!backtest.value || backtest.value.status !== 'running') return
  
  try {
    await backtestStore.fetchBacktestById(backtest.value.id!)
  } catch (error) {
    console.error('检查回测状态失败:', error)
  }
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    
    // 并行加载必要的数据
    await Promise.all([
      backtestStore.fetchBacktestById(id),
      priceDataStore.fetchTimeframes(),
      priceDataStore.fetchTradingPairs(),
      strategyStore.fetchStrategies()
    ])
    
    // 如果回测已完成，加载交易记录
    if (backtest.value?.status === 'completed') {
      await loadTrades()
    }
    
    // 如果回测正在运行，启动状态检查
    if (backtest.value?.status === 'running') {
      statusCheckInterval = setInterval(checkStatus, 30000) // 每30秒检查一次
    }
  } catch (error) {
    console.error('加载回测详情失败:', error)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>