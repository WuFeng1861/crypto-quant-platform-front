<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('indicators.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理和创建技术指标
        </p>
      </div>
      <router-link to="/indicators/create">
        <el-button type="primary" :icon="Plus">
          {{ $t('indicators.create') }}
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
        <el-button @click="resetFilters">
          {{ $t('common.reset') }}
        </el-button>
      </div>
    </div>

    <!-- 指标列表 -->
    <div class="card">
      <div v-if="indicatorStore.loading" class="p-6">
        <LoadingSpinner />
      </div>

      <div v-else-if="!filteredIndicators || filteredIndicators.length === 0" class="p-6">
        <EmptyState
          title="暂无指标"
          description="开始创建您的第一个技术指标"
          action-text="创建指标"
          @action="$router.push('/indicators/create')"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.description') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.parameters') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.createdAt') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="indicator in filteredIndicators" :key="indicator.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ indicator.name }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {{ indicator.description || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ indicator.parameters?.length || 0 }} 个参数
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(indicator.createdAt!) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <router-link :to="`/indicators/${indicator.id}`">
                  <el-button size="small" type="primary" link>
                    查看
                  </el-button>
                </router-link>
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="handleDelete(indicator)"
                >
                  {{ $t('common.delete') }}
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
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useIndicatorStore } from '@/stores/indicators'
import { formatTime } from '@/utils/format'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { Indicator } from '@/types'

const indicatorStore = useIndicatorStore()

const searchQuery = ref('')

const filteredIndicators = computed(() => {
  let indicators = indicatorStore.indicators
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    indicators = indicators.filter(indicator =>
      indicator.name.toLowerCase().includes(query) ||
      (indicator.description && indicator.description.toLowerCase().includes(query))
    )
  }
  
  return indicators
})

const resetFilters = () => {
  searchQuery.value = ''
}

const handleDelete = async (indicator: Indicator) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除指标 "${indicator.name}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await indicatorStore.deleteIndicator(indicator.id!)
    ElMessage.success('指标删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  indicatorStore.fetchIndicators()
})
</script>