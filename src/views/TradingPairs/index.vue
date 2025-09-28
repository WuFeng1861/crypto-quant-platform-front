<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('tradingPairs.title') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('tradingPairs.subtitle') }}
        </p>
      </div>
      <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
        {{ $t('tradingPairs.create') }}
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

    <!-- 交易对列表 -->
    <div class="theme-card">
      <div v-if="priceDataStore.loading" class="p-6">
        <LoadingSpinner />
      </div>

      <div v-else-if="!filteredTradingPairs || filteredTradingPairs.length === 0" class="p-6">
        <EmptyState
          :title="$t('tradingPairs.noDataTitle')"
          :description="$t('tradingPairs.noDataDescription')"
          :action-text="$t('tradingPairs.noDataAction')"
          @action="showCreateDialog = true"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="theme-table">
          <thead class="theme-table-header">
            <tr>
              <th class="theme-table-header-cell">
                ID
              </th>
              <th class="theme-table-header-cell">
                {{ $t('tradingPairs.symbol') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('tradingPairs.baseCurrency') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('tradingPairs.quoteCurrency') }}
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
            <tr v-for="pair in filteredTradingPairs" :key="pair.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ pair.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ pair.symbol }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ pair.baseAsset }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ pair.quoteAsset }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(pair.createdAt!) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <el-button
                  size="small"
                  type="danger"
                  link
                  @click="handleDelete(pair)"
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
      :title="$t('tradingPairs.create')"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="$t('tradingPairs.symbol')" prop="symbol">
          <el-input
            v-model="form.symbol"
            :placeholder="$t('tradingPairs.symbol')"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item :label="$t('tradingPairs.baseCurrency')" prop="baseAsset">
          <el-input
            v-model="form.baseAsset"
            :placeholder="$t('tradingPairs.baseCurrency')"
            maxlength="10"
          />
        </el-form-item>

        <el-form-item :label="$t('tradingPairs.quoteCurrency')" prop="quoteAsset">
          <el-input
            v-model="form.quoteAsset"
            :placeholder="$t('tradingPairs.quoteCurrency')"
            maxlength="10"
          />
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
import type { TradingPair } from '@/types'
import { useI18n } from 'vue-i18n'

const priceDataStore = usePriceDataStore()
const { t: $t } = useI18n()

const searchQuery = ref('')
const showCreateDialog = ref(false)
const creating = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  symbol: '',
  baseAsset: '',
  quoteAsset: ''
})

const rules = {
  symbol: [validationRules.required(), validationRules.maxLength(20)],
  baseAsset: [validationRules.required(), validationRules.maxLength(10)],
  quoteAsset: [validationRules.required(), validationRules.maxLength(10)]
}

const filteredTradingPairs = computed(() => {
  let pairs = priceDataStore.tradingPairs
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    pairs = pairs.filter(pair =>
      pair.symbol.toLowerCase().includes(query) ||
      pair.baseAsset.toLowerCase().includes(query) ||
      pair.quoteAsset.toLowerCase().includes(query)
    )
  }
  
  return pairs
})

const handleCreate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    creating.value = true
    
    await priceDataStore.createTradingPair(form)
    ElMessage.success($t('tradingPairs.createSuccess'))
    showCreateDialog.value = false
    resetForm()
  } catch (error) {
    console.error('创建交易对失败:', error)
  } finally {
    creating.value = false
  }
}

const handleDelete = async (pair: TradingPair) => {
  try {
    await ElMessageBox.confirm(
      $t('tradingPairs.deleteConfirm', { symbol: pair.symbol }),
      $t('common.confirmDelete'),
      {
        confirmButtonText: $t('common.delete'),
        cancelButtonText: $t('common.cancel'),
        type: 'warning'
      }
    )
    
    await priceDataStore.deleteTradingPair(pair.id)
    ElMessage.success($t('tradingPairs.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error($t('tradingPairs.deleteFailed'))
    }
  }
}

const resetForm = () => {
  form.symbol = ''
  form.baseAsset = ''
  form.quoteAsset = ''
  formRef.value?.resetFields()
}

onMounted(() => {
  priceDataStore.fetchTradingPairs()
})
</script>