<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('indicators.title') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('indicators.subtitle') }}
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
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <div class="flex-1">
            <el-input
              v-model="searchQuery"
              :placeholder="$t('common.search')"
              :prefix-icon="Search"
              clearable
            />
          </div>
          <!-- 指标类型切换 -->
          <el-radio-group v-model="indicatorType" size="default">
            <el-radio-button value="normal">
              {{ $t('indicators.normalIndicators') }}
              <el-badge :value="normalIndicatorsCount" type="primary" class="ml-1" />
            </el-radio-button>
            <el-radio-button value="ai">
              {{ $t('indicators.aiIndicators') }}
              <el-badge :value="aiIndicatorsCount" type="success" class="ml-1" />
            </el-radio-button>
          </el-radio-group>
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
          :title="indicatorType === 'ai' ? $t('indicators.noAiIndicators') : $t('indicators.noDataTitle')"
          :description="indicatorType === 'ai' ? $t('indicators.noAiIndicatorsDesc') : $t('indicators.noDataDescription')"
          :action-text="$t('indicators.create')"
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
                <div class="flex items-center gap-2">
                  <el-tag v-if="isAIIndicator(indicator.name)" type="success" size="small" effect="dark">
                    AI
                  </el-tag>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ indicator.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {{ indicator.description || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ indicator.parameters?.length || 0 }} {{ $t('common.parameters') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(indicator.createdAt!) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <router-link :to="`/indicators/${indicator.id}`">
                  <el-button size="small" type="primary" link>
                    {{ $t('common.view') }}
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
import { useI18n } from 'vue-i18n'

const indicatorStore = useIndicatorStore()
const { t } = useI18n()

const searchQuery = ref('')
const indicatorType = ref<'normal' | 'ai'>('normal')

const isAIIndicator = (name: string): boolean => {
  return name.startsWith('AI_')
}

const normalIndicatorsCount = computed(() => {
  return indicatorStore.indicators.filter(i => !isAIIndicator(i.name)).length
})

const aiIndicatorsCount = computed(() => {
  return indicatorStore.indicators.filter(i => isAIIndicator(i.name)).length
})

const filteredIndicators = computed(() => {
  let indicators = indicatorStore.indicators
  
  // 根据类型筛选
  if (indicatorType.value === 'ai') {
    indicators = indicators.filter(i => isAIIndicator(i.name))
  } else {
    indicators = indicators.filter(i => !isAIIndicator(i.name))
  }
  
  // 根据搜索词筛选
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
  indicatorType.value = 'normal'
}

const handleDelete = async (indicator: Indicator) => {
  try {
    await ElMessageBox.confirm(
      t('indicators.confirmDeleteMessage', { name: indicator.name }),
      t('common.confirmDelete'),
      {
        confirmButtonText: t('common.delete'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    await indicatorStore.deleteIndicator(indicator.id!)
    ElMessage.success(t('indicators.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('indicators.deleteFailed'))
    }
  }
}

onMounted(() => {
  indicatorStore.fetchIndicators()
})
</script>
