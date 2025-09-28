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
        <el-table-column :label="$t('common.actions')" width="200" fixed="right">
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
import type { StrategyWithDetails } from '@/types'
import { useI18n } from 'vue-i18n'

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