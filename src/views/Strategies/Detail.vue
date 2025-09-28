<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ strategy?.name || '策略详情' }}
        </h1>
        <p class="page-subtitle">
          查看策略配置和使用情况
        </p>
      </div>
      <div class="flex space-x-2">
        <router-link v-if="strategy" :to="`/strategies/edit/${strategy.id}`">
          <el-button type="primary" :icon="Edit">
            编辑策略
          </el-button>
        </router-link>
        <router-link to="/strategies">
          <el-button :icon="ArrowLeft">
            返回列表
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

      <!-- 风险管理 -->
      <StrategyDetailRisk :strategy="strategy" />

      <!-- 使用的指标 -->
      <StrategyDetailIndicators :strategy="strategy" />

      <!-- 交易条件 -->
      <StrategyDetailConditions :strategy="strategy" />

      <!-- 回测历史 -->
      <div class="theme-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">
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
          <EmptyState 
            title="暂无回测记录" 
            description="该策略还没有进行过回测"
            :icon="null"
          />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="theme-table">
            <thead class="theme-table-header">
              <tr>
                <th class="theme-table-header-cell">交易对</th>
                <th class="theme-table-header-cell">时间范围</th>
                <th class="theme-table-header-cell">收益率</th>
                <th class="theme-table-header-cell">状态</th>
                <th class="theme-table-header-cell">创建时间</th>
                <th class="theme-table-header-cell">操作</th>
              </tr>
            </thead>
            <tbody class="theme-table-body">
              <tr v-for="backtest in backtests" :key="backtest.id" class="theme-table-row">
                <td class="theme-table-cell">
                  {{ getTradingPairSymbol(backtest.pairId) }}
                </td>
                <td class="theme-table-cell">
                  <div class="text-sm">
                    <div>{{ formatDate(backtest.startTime) }}</div>
                    <div class="text-gray-500 dark:text-gray-400">至 {{ formatDate(backtest.endTime) }}</div>
                  </div>
                </td>
                <td class="theme-table-cell">
                  <span :class="getReturnRateClass(parseFloat(backtest.profitRate || '0'))">
                    {{ formatPercent(backtest.profitRate || '0', 2, true) }}
                  </span>
                </td>
                <td class="theme-table-cell">
                  <span :class="getStatusClass(backtest.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatBacktestStatus(backtest.status) }}
                  </span>
                </td>
                <td class="theme-table-cell">
                  {{ formatTime(backtest.createdAt) }}
                </td>
                <td class="theme-table-cell">
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
      <EmptyState 
        title="策略不存在" 
        description="找不到指定的策略，可能已被删除或ID错误"
        :icon="null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStrategyStore } from '@/stores/strategies'
import { useIndicatorStore } from '@/stores/indicators'
import { useBacktestStore } from '@/stores/backtest'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime, formatPercent, formatBacktestStatus } from '@/utils/format'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import StrategyDetailInfo from '@/components/Strategy/StrategyDetailInfo.vue'
import StrategyDetailRisk from '@/components/Strategy/StrategyDetailRisk.vue'
import StrategyDetailIndicators from '@/components/Strategy/StrategyDetailIndicators.vue'
import StrategyDetailConditions from '@/components/Strategy/StrategyDetailConditions.vue'
import type { Backtest, StrategyWithDetails } from '@/types'

const route = useRoute()
const router = useRouter()
const strategyStore = useStrategyStore()
const indicatorStore = useIndicatorStore()
const backtestStore = useBacktestStore()
const priceDataStore = usePriceDataStore()

const loading = ref(true)
const loadingBacktests = ref(false)
const backtests = ref<Backtest[]>([])
const strategy = ref<StrategyWithDetails | null>(null)

// 格式化日期（只显示日期部分）
const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classes = {
    running: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    completed: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    failed: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    pending: 'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

// 获取收益率样式类
const getReturnRateClass = (rate: number) => {
  if (rate > 0) return 'text-success-600 dark:text-success-400 font-medium'
  if (rate < 0) return 'text-danger-600 dark:text-danger-400 font-medium'
  return 'text-gray-900 dark:text-white'
}

// 获取交易对符号
const getTradingPairSymbol = (pairId: number) => {
  const pair = priceDataStore.tradingPairs?.find(p => p.id === pairId)
  return pair?.symbol || `交易对 #${pairId}`
}

// 加载回测记录
const loadBacktests = async () => {
  if (!strategy.value) return
  
  loadingBacktests.value = true
  try {
    await backtestStore.fetchBacktests()
    backtests.value = backtestStore.backtests.filter(b => b.strategyId === strategy.value!.id)
  } catch (error) {
    console.error('加载回测记录失败:', error)
    ElMessage.error('加载回测记录失败')
  } finally {
    loadingBacktests.value = false
  }
}

// 加载策略详情
const loadStrategy = async (id: number) => {
  try {
    // 先尝试从store中获取
    let strategyData = strategyStore.getStrategyById(id)
    
    if (!strategyData) {
      // 如果store中没有，则从API获取
      await strategyStore.fetchStrategies()
      strategyData = strategyStore.getStrategyById(id)
    }
    
    if (!strategyData) {
      // 尝试单独获取策略详情
      strategyData = await strategyStore.fetchStrategyById(id)
    }
    
    strategy.value = strategyData
    return strategyData
  } catch (error) {
    console.error('加载策略详情失败:', error)
    ElMessage.error('加载策略详情失败')
    throw error
  }
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (!id || isNaN(id)) {
      ElMessage.error('无效的策略ID')
      router.push('/strategies')
      return
    }
    
    // 并行加载基础数据
    await Promise.all([
      indicatorStore.fetchIndicators(),
      priceDataStore.fetchTradingPairs()
    ])
    
    // 加载策略详情
    await loadStrategy(id)
    
    // 加载回测记录
    if (strategy.value) {
      await loadBacktests()
    }
  } catch (error) {
    console.error('页面初始化失败:', error)
  } finally {
    loading.value = false
  }
})
</script>