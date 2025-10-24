<template>
  <div class="strategy-manager">
    <!-- 策略列表 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ $t('strategyManager.title') }}</h3>
        <div class="flex space-x-2">
          <el-button @click="refreshStrategies" :icon="Refresh" :loading="loading">
            {{ $t('common.refresh') }}
          </el-button>
          <router-link to="/strategies/create">
            <el-button type="primary" :icon="Plus">
              {{ $t('strategyManager.createStrategy') }}
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
        <el-table-column prop="id" :label="$t('common.id')" width="80" />
        <el-table-column prop="name" :label="$t('strategyManager.strategyName')" min-width="150" />
        <el-table-column prop="description" :label="$t('common.description')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="positionType" :label="$t('strategyManager.positionType')" width="100">
          <template #default="{ row }">
            <el-tag :type="getPositionTypeTag(row.positionType)">
              {{ getPositionTypeText(row.positionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategyManager.indicatorCount')" width="100">
          <template #default="{ row }">
            {{ row.indicators?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategyManager.conditionCount')" width="100">
          <template #default="{ row }">
            {{ row.conditions?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('common.createdAt')" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="350" fixed="right">
          <template #default="{ row }">
            <div class="flex space-x-1">
              <router-link :to="`/strategies/${row.id}`">
                <el-button size="small" :icon="View">
                  {{ $t('common.view') }}
                </el-button>
              </router-link>
              <el-button size="small" type="primary" @click="editStrategy(row)" :icon="Edit">
                {{ $t('common.edit') }}
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                @click="copyStrategy(row)"
                :icon="CopyDocument"
              >
                {{ $t('strategyManager.copy') }}
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteStrategy(row)"
                :icon="Delete"
              >
                {{ $t('common.delete') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- 复制策略对话框 -->
    <el-dialog
      v-model="showCopyDialog"
      :title="$t('strategyManager.copyStrategy')"
      width="30%"
    >
      <el-form>
        <el-form-item :label="$t('strategyManager.newStrategyName')" required>
          <el-input v-model="newStrategyName" autofocus />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCopyDialog = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleCopyConfirm" :loading="loading">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
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
  Operation,
  CopyDocument
} from '@element-plus/icons-vue'
import type { StrategyWithDetails } from '@/types'
import { useI18n } from 'vue-i18n'

const showCopyDialog = ref(false)
const newStrategyName = ref('')
const currentStrategy = ref<StrategyWithDetails | null>(null)

const { t: $t } = useI18n()

const router = useRouter()
const strategyStore = useStrategyStore()

const loading = ref(false)

const strategies = computed(() => strategyStore.strategies)

const refreshStrategies = async () => {
  loading.value = true
  try {
    await strategyStore.fetchStrategies(true)
  } catch (error) {
    ElMessage.error($t('strategyManager.fetchStrategiesFailed'))
  } finally {
    loading.value = false
  }
}



const editStrategy = (strategy: StrategyWithDetails) => {
  router.push(`/strategies/edit/${strategy.id}`)
}

const copyStrategy = async (strategy: StrategyWithDetails) => {
  currentStrategy.value = strategy
  newStrategyName.value = `${strategy.name} (Copy)`
  showCopyDialog.value = true
}

const handleCopyConfirm = async () => {
  if (!newStrategyName.value.trim()) {
    ElMessage.error($t('strategyManager.nameRequired'))
    return
  }
  
  loading.value = true
  try {
    // 获取完整的策略数据
    const strategyData = await strategyStore.fetchStrategyWithDetails(currentStrategy.value!.id!)
    
    // 创建新策略数据，复制原策略的所有属性
    const newStrategyData = {
      name: newStrategyName.value,
      description: strategyData.description,
      positionType: strategyData.positionType,
      buyFee: Math.max(0, Math.min(1, parseFloat(strategyData.buyFee as any))), // 确保在0到1之间
      sellFee: Math.max(0, Math.min(1, parseFloat(strategyData.sellFee as any))), // 确保在0到1之间
      liquidationThreshold: Math.max(0, Math.min(100, parseFloat(strategyData.liquidationThreshold as any))), // 确保在0到100之间
      takeProfitRatio: strategyData.takeProfitRatio,
      stopLossRatio: strategyData.stopLossRatio,
      indicators: strategyData.indicators.map(indicator => ({
        indicatorId: indicator.indicatorId,
        priority: indicator.priority,
        parameters: indicator.parameters
      })),
      conditions: strategyData.conditions.map(condition => ({
        indicatorIndex: condition.indicatorIndex,
        comparisonType: condition.comparisonType,
        comparedIndicatorIndex: condition.comparedIndicatorIndex,
        constantValue: condition.constantValue,
        currentValuePath: condition.currentValuePath,
        comparedValuePath: condition.comparedValuePath,
        operator: condition.operator,
        conditionType: condition.conditionType,
        action: condition.action,
        group: condition.group,
        priority: condition.priority,
        customCode: condition.customCode
      }))
    }
    
    // 调用创建策略接口
    await strategyStore.createStrategy(newStrategyData)
    ElMessage.success($t('strategyManager.copySuccess'))
    showCopyDialog.value = false
    newStrategyName.value = ''
    await refreshStrategies()
  } catch (error) {
    console.error('复制策略失败:', error)
    ElMessage.error($t('strategyManager.copyFailed'))
  } finally {
    loading.value = false
  }
}

const deleteStrategy = async (strategy: StrategyWithDetails) => {
  try {
    await ElMessageBox.confirm(
      $t('strategyManager.confirmDelete', { strategyName: strategy.name }),
      $t('common.confirmDeletion'),
      {
        confirmButtonText: $t('common.confirm'),
        cancelButtonText: $t('common.cancel'),
        type: 'warning',
      }
    )

    loading.value = true
    await strategyStore.deleteStrategy(strategy.id!)
    ElMessage.success($t('strategyManager.deleteSuccess'))
    await refreshStrategies()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error($t('strategyManager.deleteFailed'))
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
    case 'long':
      return $t('common.long')
    case 'short':
      return $t('common.short')
    case 'both':
      return $t('common.both')
    default:
      return $t('common.unknown')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
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