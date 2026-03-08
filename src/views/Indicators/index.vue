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
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="indicator in filteredIndicators" :key="indicator.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ indicator.name }}
                  </div>
                  <el-tag v-if="isAIIndicator(indicator.name)" size="small" type="warning" class="ml-2">AI</el-tag>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">
                  {{ indicator.description || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <el-tag
                    v-for="param in indicator.parameters"
                    :key="param.name"
                    size="small"
                    type="info"
                    class="mr-1 mb-1"
                  >
                    {{ param.name }}: {{ param.defaultValue || '-' }}
                  </el-tag>
                  <span v-if="!indicator.parameters || indicator.parameters.length === 0" class="text-xs text-gray-400">
                    {{ $t('common.none') }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <router-link :to="`/indicators/${indicator.id}`">
                    <el-button size="small" :icon="View">
                      {{ $t('common.view') }}
                    </el-button>
                  </router-link>
                  <el-button size="small" type="primary" :icon="Edit" @click="handleEdit(indicator)">
                    {{ $t('common.edit') }}
                  </el-button>
                  <el-button size="small" type="success" :icon="CopyDocument" @click="handleCopy(indicator)">
                    {{ $t('common.copy') }}
                  </el-button>
                  <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(indicator)">
                    {{ $t('common.delete') }}
                  </el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 复制指标对话框 -->
    <el-dialog
      v-model="showCopyDialog"
      :title="$t('indicators.copyIndicator')"
      width="400px"
    >
      <el-form label-position="top">
        <el-form-item :label="$t('indicators.newIndicatorName')">
          <el-input v-model="newIndicatorName" :placeholder="$t('indicators.inputNewIndicatorName')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showCopyDialog = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="copyLoading" @click="confirmCopy">{{ $t('common.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIndicatorStore } from '@/stores/indicators'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, View, Edit, Delete, CopyDocument } from '@element-plus/icons-vue'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import type { Indicator } from '@/types'
import { useRouter } from 'vue-router'

const indicatorStore = useIndicatorStore()
const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const indicatorType = ref<'normal' | 'ai'>('normal')
const showCopyDialog = ref(false)
const newIndicatorName = ref('')
const copyLoading = ref(false)
const currentIndicator = ref<Indicator | null>(null)

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

const handleEdit = (indicator: Indicator) => {
  router.push(`/indicators/edit/${indicator.id}`)
}

const handleCopy = (indicator: Indicator) => {
  currentIndicator.value = indicator
  newIndicatorName.value = `${indicator.name}_Copy`
  showCopyDialog.value = true
}

const confirmCopy = async () => {
  if (!newIndicatorName.value.trim()) {
    ElMessage.warning(t('indicators.inputNewIndicatorName'))
    return
  }

  if (indicatorStore.indicators.some(i => i.name === newIndicatorName.value)) {
    ElMessage.warning(t('indicators.indicatorNameExists'))
    return
  }

  copyLoading.value = true
  try {
    await indicatorStore.copyIndicator(currentIndicator.value!.id!, newIndicatorName.value)
    ElMessage.success(t('indicators.copySuccess'))
    showCopyDialog.value = false
  } catch (error) {
    console.error('复制指标失败:', error)
    ElMessage.error(t('indicators.copyFailed'))
  } finally {
    copyLoading.value = false
  }
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
      console.error('删除指标失败:', error)
      ElMessage.error(t('indicators.deleteFailed'))
    }
  }
}

onMounted(async () => {
  if (indicatorStore.indicators.length === 0) {
    await indicatorStore.fetchIndicators()
  }
})
</script>
