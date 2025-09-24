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
        <router-link :to="`/strategies/${strategy?.id}/edit`">
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
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">基本信息</h3>
        
        <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">策略名称</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">仓位类型</dt>
            <dd class="mt-1">
              <span :class="getPositionTypeClass(strategy.positionType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ formatPositionType(strategy.positionType) }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">创建时间</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(strategy.createdAt) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">买入手续费</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatPercent(strategy.buyFee) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">卖出手续费</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatPercent(strategy.sellFee) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">爆仓阈值</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.liquidationThreshold }}%</dd>
          </div>
          <div v-if="strategy.takeProfitRatio">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">止盈比例</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.takeProfitRatio }}%</dd>
          </div>
          <div v-if="strategy.stopLossRatio">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">止损比例</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.stopLossRatio }}%</dd>
          </div>
        </dl>

        <div v-if="strategy.description" class="mt-4">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">策略描述</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ strategy.description }}</dd>
        </div>
      </div>

      <!-- 使用的指标 -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          使用的指标 ({{ strategy.indicators?.length || 0 }})
        </h3>

        <div v-if="!strategy.indicators?.length" class="text-center py-8">
          <EmptyState message="暂未配置指标" />
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(indicator, index) in strategy.indicators"
            :key="index"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                指标 {{ index + 1 }}: {{ getIndicatorName(indicator.indicatorId) }}
              </h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                优先级: {{ indicator.priority || 1 }}
              </span>
            </div>

            <div v-if="indicator.parameters?.length" class="mt-2">
              <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">参数配置</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div
                  v-for="param in indicator.parameters"
                  :key="param.parameterId"
                  class="text-xs"
                >
                  <span class="text-gray-600 dark:text-gray-400">
                    {{ getParameterName(indicator.indicatorId, param.parameterId) }}:
                  </span>
                  <span class="text-gray-900 dark:text-white ml-1">
                    {{ param.value }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 交易条件 -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          交易条件 ({{ strategy.conditions?.length || 0 }})
        </h3>

        <div v-if="!strategy.conditions?.length" class="text-center py-8">
          <EmptyState message="暂未配置交易条件" />
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(condition, index) in strategy.conditions"
            :key="index"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                条件 {{ index + 1 }}
              </h4>
              <div class="flex items-center space-x-2">
                <span :class="getActionClass(condition.action)" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium">
                  {{ formatAction(condition.action) }}
                </span>
                <span v-if="condition.priority" class="text-xs text-gray-500 dark:text-gray-400">
                  优先级: {{ condition.priority }}
                </span>
              </div>
            </div>

            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>
                指标{{ condition.indicatorIndex + 1 }} 
                {{ condition.operator }} 
                <span v-if="condition.comparisonType === 'constant'">
                  {{ condition.constantValue }}
                </span>
                <span v-else>
                  指标{{ (condition.comparedIndicatorIndex || 0) + 1 }}
                </span>
              </p>
              
              <div v-if="condition.customCode" class="mt-2">
                <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">自定义代码</h5>
                <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto"><code>{{ condition.customCode }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <EmptyState message="暂无回测记录" />
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
      <EmptyState message="策略不存在" />
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

const getIndicatorName = (indicatorId: number) => {
  const indicator = indicatorStore.indicators.find(i => i.id === indicatorId)
  return indicator?.name || `指标${indicatorId}`
}

const getParameterName = (indicatorId: number, parameterId: number) => {
  const indicator = indicatorStore.indicators.find(i => i.id === indicatorId)
  const parameter = indicator?.parameters.find(p => p.id === parameterId)
  return parameter?.name || `参数${parameterId}`
}

const getPositionTypeClass = (type: string) => {
  const classes = {
    long: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    short: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    both: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getActionClass = (action: string) => {
  const classes = {
    buy: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    sell: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    none: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[action as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatAction = (action: string) => {
  const actions = {
    buy: '买入',
    sell: '卖出',
    none: '无操作'
  }
  return actions[action as keyof typeof actions] || action
}

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
    
    // 并行加载数据
    await Promise.all([
      strategyStore.fetchStrategy(id),
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