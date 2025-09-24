<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('strategies.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理和创建交易策略
        </p>
      </div>
      <router-link to="/strategies/create">
        <el-button type="primary" :icon="Plus">
          {{ $t('strategies.create') }}
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
        <el-select v-model="positionTypeFilter" placeholder="仓位类型" clearable class="w-40">
          <el-option label="全部" value="" />
          <el-option label="做多" value="long" />
          <el-option label="做空" value="short" />
          <el-option label="双向" value="both" />
        </el-select>
        <el-button @click="resetFilters">
          {{ $t('common.reset') }}
        </el-button>
      </div>
    </div>

    <!-- 策略列表 -->
    <div v-if="strategyStore.loading" class="card p-6">
      <LoadingSpinner />
    </div>

    <div v-else-if="!filteredStrategies || filteredStrategies.length === 0" class="card p-6">
      <EmptyState
        title="暂无策略"
        description="开始创建您的第一个交易策略"
        action-text="创建策略"
        @action="$router.push('/strategies/create')"
      />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="strategy in filteredStrategies"
        :key="strategy.id"
        class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/strategies/${strategy.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ strategy.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ strategy.description || '暂无描述' }}
            </p>
          </div>
          <el-dropdown @command="(command) => handleAction(command, strategy)" trigger="click">
            <el-button size="small" text>
              <MoreFilled class="h-4 w-4" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view">查看详情</el-dropdown-item>
                <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="space-y-3">
          <!-- 仓位类型 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">仓位类型</span>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getPositionTypeClass(strategy.positionType)">
              {{ formatPositionType(strategy.positionType) }}
            </span>
          </div>

          <!-- 手续费 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">手续费</span>
            <span class="text-sm text-gray-900 dark:text-white">
              {{ formatPercent(strategy.buyFee) }} / {{ formatPercent(strategy.sellFee) }}
            </span>
          </div>

          <!-- 指标数量 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">指标数量</span>
            <span class="text-sm text-gray-900 dark:text-white">
              {{ strategy.indicatorCount }} 个
            </span>
          </div>

          <!-- 条件数量 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">交易条件</span>
            <span class="text-sm text-gray-900 dark:text-white">
              {{ strategy.conditionCount }} 个
            </span>
          </div>

          <!-- 创建时间 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">创建时间</span>
            <span class="text-sm text-gray-900 dark:text-white">
              {{ formatTime(strategy.createdAt!, 'MM-DD HH:mm') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStrategyStore } from '@/stores/strategies'
import { formatTime, formatPercent, formatPositionType } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import { Plus, Search, MoreFilled } from '@element-plus/icons-vue'
import type { StrategyWithDetails } from '@/types'

const strategyStore = useStrategyStore()

const searchQuery = ref('')
const positionTypeFilter = ref('')

const filteredStrategies = computed(() => {
  let strategies = strategyStore.strategies
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    strategies = strategies.filter(strategy =>
      strategy.name.toLowerCase().includes(query) ||
      (strategy.description && strategy.description.toLowerCase().includes(query))
    )
  }
  
  if (positionTypeFilter.value) {
    strategies = strategies.filter(strategy => strategy.positionType === positionTypeFilter.value)
  }
  
  return strategies
})

const resetFilters = () => {
  searchQuery.value = ''
  positionTypeFilter.value = ''
}

const getPositionTypeClass = (type: string) => {
  switch (type) {
    case 'long':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'short':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'both':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const handleAction = async (command: string, strategy: StrategyWithDetails) => {
  switch (command) {
    case 'view':
      // 阻止事件冒泡，避免触发卡片点击
      window.location.href = `/strategies/${strategy.id}`
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `确定要删除策略 "${strategy.name}" 吗？此操作不可撤销。`,
          '确认删除',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await strategyStore.deleteStrategy(strategy.id!)
        ElMessage.success('策略删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
      break
  }
}

onMounted(() => {
  strategyStore.fetchStrategies()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>