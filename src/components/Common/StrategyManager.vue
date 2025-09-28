<template>
  <div class="strategy-manager">
    <!-- 策略列表 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">策略管理</h3>
        <div class="flex space-x-2">
          <el-button @click="refreshStrategies" :icon="Refresh" :loading="loading">
            刷新
          </el-button>
          <router-link to="/strategies/create">
            <el-button type="primary" :icon="Plus">
              创建策略
            </el-button>
          </router-link>
        </div>
      </div>

      <el-table
        :data="strategies"
        v-loading="loading"
        stripe
        class="w-full"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="策略名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="positionType" label="仓位类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getPositionTypeTag(row.positionType)">
              {{ getPositionTypeText(row.positionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="指标数量" width="100">
          <template #default="{ row }">
            {{ row.indicators?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="条件数量" width="100">
          <template #default="{ row }">
            {{ row.conditions?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="flex space-x-1">
              <el-button size="small" @click="viewStrategy(row)" :icon="View">
                查看
              </el-button>
              <el-button size="small" type="primary" @click="editStrategy(row)" :icon="Edit">
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteStrategy(row)"
                :icon="Delete"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 策略详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="策略详情"
      width="80%"
      :before-close="handleCloseDetail"
    >
      <div v-if="selectedStrategy" class="space-y-6">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">基本信息</h4>
            <div class="space-y-2 text-sm">
              <div><strong>名称:</strong> {{ selectedStrategy.name }}</div>
              <div><strong>描述:</strong> {{ selectedStrategy.description || '无' }}</div>
              <div><strong>仓位类型:</strong> {{ getPositionTypeText(selectedStrategy.positionType) }}</div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">风险管理</h4>
            <div class="space-y-2 text-sm">
              <div><strong>买入手续费:</strong> {{ (selectedStrategy.buyFee * 100).toFixed(4) }}%</div>
              <div><strong>卖出手续费:</strong> {{ (selectedStrategy.sellFee * 100).toFixed(4) }}%</div>
              <div><strong>清仓阈值:</strong> {{ selectedStrategy.liquidationThreshold }}%</div>
              <div><strong>止盈比例:</strong> {{ selectedStrategy.takeProfitRatio }}%</div>
              <div><strong>止损比例:</strong> {{ selectedStrategy.stopLossRatio }}%</div>
            </div>
          </div>
        </div>

        <!-- 指标配置 -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">指标配置</h4>
          <div v-if="selectedStrategy.indicators?.length" class="space-y-2">
            <div
              v-for="(indicator, index) in selectedStrategy.indicators"
              :key="index"
              class="p-3 border border-gray-200 dark:border-gray-700 rounded"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">指标 {{ index + 1 }}</span>
                <el-tag size="small">优先级: {{ indicator.priority }}</el-tag>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                ID: {{ indicator.indicatorId }}
              </div>
              <div v-if="indicator.parameters?.length" class="mt-2">
                <div class="text-xs text-gray-500 mb-1">参数:</div>
                <div class="flex flex-wrap gap-2">
                  <el-tag
                    v-for="param in indicator.parameters"
                    :key="param.parameterId"
                    size="small"
                    type="info"
                  >
                    {{ param.parameterId }}: {{ param.value }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-sm">暂无指标配置</div>
        </div>

        <!-- 交易条件 -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">交易条件</h4>
          <div v-if="selectedStrategy.conditions?.length">
            <ConditionLogicVisualizer 
              :conditions="selectedStrategy.conditions" 
              :show-example="false"
            />
          </div>
          <div v-else class="text-gray-500 text-sm">暂无交易条件</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStrategyStore } from '@/stores/strategies'
import { 
  Refresh, 
  Plus, 
  View, 
  Edit, 
  Delete, 
  TrendCharts, 
  Operation 
} from '@element-plus/icons-vue'
import ConditionLogicVisualizer from './ConditionLogicVisualizer.vue'
import type { StrategyWithDetails } from '@/types'

const router = useRouter()
const strategyStore = useStrategyStore()

const loading = ref(false)
const showDetailDialog = ref(false)
const selectedStrategy = ref<StrategyWithDetails | null>(null)

const strategies = computed(() => strategyStore.strategies)

const refreshStrategies = async () => {
  loading.value = true
  try {
    await strategyStore.fetchStrategies(true)
  } catch (error) {
    ElMessage.error('获取策略列表失败')
  } finally {
    loading.value = false
  }
}

const viewStrategy = (strategy: StrategyWithDetails) => {
  selectedStrategy.value = strategy
  showDetailDialog.value = true
}

const editStrategy = (strategy: StrategyWithDetails) => {
  router.push(`/strategies/edit/${strategy.id}`)
}

const deleteStrategy = async (strategy: StrategyWithDetails) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除策略 "${strategy.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    loading.value = true
    await strategyStore.deleteStrategy(strategy.id!)
    ElMessage.success('策略删除成功')
    await refreshStrategies()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除策略失败')
    }
  } finally {
    loading.value = false
  }
}

const getPositionTypeTag = (type: string) => {
  switch (type) {
    case 'long': return 'success'
    case 'short': return 'danger'
    case 'both': return 'warning'
    default: return 'info'
  }
}

const getPositionTypeText = (type: string) => {
  switch (type) {
    case 'long': return '做多'
    case 'short': return '做空'
    case 'both': return '双向'
    default: return '未知'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const handleCloseDetail = () => {
  showDetailDialog.value = false
  selectedStrategy.value = null
}

onMounted(() => {
  refreshStrategies()
})
</script>

<style scoped>
.strategy-manager {
  /* 自定义样式 */
}
</style>