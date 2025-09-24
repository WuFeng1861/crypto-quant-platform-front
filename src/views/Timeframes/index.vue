<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('timeframes.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          管理时间框架配置
        </p>
      </div>
      <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
        {{ $t('timeframes.create') }}
      </el-button>
    </div>

    <!-- 搜索 -->
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
        <el-button @click="searchQuery = ''">
          {{ $t('common.reset') }}
        </el-button>
      </div>
    </div>

    <!-- 时间框架列表 -->
    <div class="card">
      <div v-if="priceDataStore.loading" class="p-6">
        <LoadingSpinner />
      </div>

      <div v-else-if="!filteredTimeframes || filteredTimeframes.length === 0" class="p-6">
        <EmptyState
          title="暂无时间框架"
          description="开始创建您的第一个时间框架"
          action-text="创建时间框架"
          @action="showCreateDialog = true"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('timeframes.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('common.description') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('timeframes.intervalMs') }}
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
            <tr v-for="timeframe in filteredTimeframes" :key="timeframe.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ timeframe.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ timeframe.name }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {{ timeframe.description || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatInterval(timeframe.intervalMs) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(timeframe.createdAt!) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="handleDelete(timeframe)"
                >
                  {{ $t('common.delete') }}
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 创建对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="$t('timeframes.create')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item :label="$t('timeframes.name')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="$t('timeframes.name')"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item :label="$t('common.description')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :placeholder="$t('common.description')"
            :rows="3"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item :label="$t('timeframes.intervalMs')" prop="intervalMs">
          <el-input-number
            v-model="form.intervalMs"
            :min="1000"
            :max="86400000"
            :step="1000"
            class="w-full"
          />
          <div class="text-xs text-gray-500 mt-1">
            常用值：1分钟=60000，5分钟=300000，1小时=3600000，1天=86400000
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreateDialog = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleCreate" :loading="creating">
            {{ $t('common.create') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage, type FormInstance } from 'element-plus'
import { usePriceDataStore } from '@/stores/priceData'
import { formatTime } from '@/utils/format'
import { validationRules } from '@/utils/validation'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { Timeframe } from '@/types'

const priceDataStore = usePriceDataStore()

const searchQuery = ref('')
const showCreateDialog = ref(false)
const creating = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  description: '',
  intervalMs: 60000
})

const rules = {
  name: [validationRules.required(), validationRules.maxLength(50)],
  intervalMs: [
    validationRules.required(),
    validationRules.range(1000, 86400000)
  ]
}

const filteredTimeframes = computed(() => {
  let timeframes = priceDataStore.timeframes
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    timeframes = timeframes.filter(timeframe =>
      timeframe.name.toLowerCase().includes(query) ||
      (timeframe.description && timeframe.description.toLowerCase().includes(query))
    )
  }
  
  return timeframes
})

const formatInterval = (intervalMs: number): string => {
  const seconds = intervalMs / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  
  if (days >= 1) {
    return `${days}天`
  } else if (hours >= 1) {
    return `${hours}小时`
  } else if (minutes >= 1) {
    return `${minutes}分钟`
  } else {
    return `${seconds}秒`
  }
}

const handleCreate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    creating.value = true
    
    await priceDataStore.createTimeframe(form)
    ElMessage.success('时间框架创建成功')
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('创建时间框架失败:', error)
  } finally {
    creating.value = false
  }
}

const handleDelete = async (timeframe: Timeframe) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除时间框架 "${timeframe.name}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await priceDataStore.deleteTimeframe(timeframe.id)
    ElMessage.success('时间框架删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.intervalMs = 60000
  formRef.value?.resetFields()
}

onMounted(() => {
  priceDataStore.fetchTimeframes()
})
</script>