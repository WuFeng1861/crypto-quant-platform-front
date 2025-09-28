<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ indicator?.name || $t('indicators.detailTitle') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('indicators.detailSubtitle') }}
        </p>
      </div>
      <router-link to="/indicators">
        <el-button :icon="ArrowLeft">
          {{ $t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <div v-if="indicatorStore.loading">
      <LoadingSpinner />
    </div>

    <div v-else-if="!indicator">
      <EmptyState
        :title="$t('indicators.notFoundTitle')"
        :description="$t('indicators.notFoundDescription')"
      />
    </div>

    <div v-else class="space-y-6">
      <!-- 指标信息 -->
      <IndicatorDetailInfo :indicator="indicator" />

      <!-- 参数列表 -->
      <IndicatorParameters :indicator="indicator" />

      <!-- 计算代码 -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('indicators.calculationCode') }}
        </h3>
        <CodeEditor
          :model-value="indicator.calculationCode"
          readonly
          language="javascript"
        />
      </div>

      <!-- 指标计算 -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('indicators.indicatorCalculation') }}
        </h3>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="$t('indicators.uploadDataCalculation')" name="upload">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('indicators.priceData') }}
                </label>
                <el-input
                  v-model="uploadData"
                  type="textarea"
                  :rows="8"
                  placeholder="{{ $t('indicators.priceDataPlaceholder') }}"
                />
              </div>
              
              <!-- 参数设置 -->
              <div v-if="indicator.parameters && indicator.parameters.length > 0">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('indicators.parameterSettings') }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="param in indicator.parameters || []" :key="param.name">
                    <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {{ param.name }}
                    </label>
                    <el-input
                      v-model="uploadParameters[param.name]"
                      :placeholder="param.defaultValue || $t('indicators.enterParameter', { name: param.name })"
                    />
                  </div>
                </div>
              </div>
              
              <el-button
                type="primary"
                @click="calculateWithUploadData"
                :loading="calculating"
              >
                {{ $t('indicators.calculateIndicator') }}
              </el-button>
            </div>
          </el-tab-pane>
          
          <el-tab-pane :label="$t('indicators.systemDataCalculation')" name="system">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ $t('common.tradingPair') }}
                  </label>
                  <el-select v-model="systemForm.pairId" :placeholder="$t('common.selectTradingPair')" class="w-full">
                    <el-option
                      v-for="pair in priceDataStore.tradingPairs"
                      :key="pair.id"
                      :label="pair.symbol"
                      :value="pair.id"
                    />
                  </el-select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ $t('common.timeframe') }}
                  </label>
                  <el-select v-model="systemForm.timeframeId" :placeholder="$t('common.selectTimeframe')" class="w-full">
                    <el-option
                      v-for="timeframe in priceDataStore.timeframes"
                      :key="timeframe.id"
                      :label="timeframe.name"
                      :value="timeframe.id"
                    />
                  </el-select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ $t('common.startTime') }}
                  </label>
                  <el-date-picker
                    v-model="systemForm.startTime"
                    type="datetime"
                    :placeholder="$t('common.selectStartTime')"
                    class="w-full"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ $t('common.endTime') }}
                  </label>
                  <el-date-picker
                    v-model="systemForm.endTime"
                    type="datetime"
                    :placeholder="$t('common.selectEndTime')"
                    class="w-full"
                  />
                </div>
              </div>
              
              <!-- 参数设置 -->
              <div v-if="indicator.parameters && indicator.parameters.length > 0">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('indicators.parameterSettings') }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="param in indicator.parameters || []" :key="param.name">
                    <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {{ param.name }}
                    </label>
                    <el-input
                      v-model="systemParameters[param.name]"
                      :placeholder="param.defaultValue || $t('indicators.enterParameter', { name: param.name })"
                    />
                  </div>
                </div>
              </div>
              
              <el-button
                type="primary"
                @click="calculateWithSystemData"
                :loading="calculating"
              >
                {{ $t('indicators.calculateIndicator') }}
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
        
        <!-- 计算结果 -->
        <div v-if="calculationResult" class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('indicators.calculationResult') }}</h4>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <pre class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{{ JSON.stringify(calculationResult, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useIndicatorStore } from '@/stores/indicators'
import { usePriceDataStore } from '@/stores/priceData'
import { indicatorApi } from '@/api/indicators'
import { formatTime } from '@/utils/format'
import { validateJSON } from '@/utils/validation'
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue'
import EmptyState from '@/components/Common/EmptyState.vue'
import CodeEditor from '@/components/Common/CodeEditor.vue'
import IndicatorDetailInfo from '@/components/Indicator/IndicatorDetailInfo.vue'
import IndicatorParameters from '@/components/Indicator/IndicatorParameters.vue'
import IndicatorCalculation from '@/components/Indicator/IndicatorCalculation.vue'
import IndicatorResults from '@/components/Indicator/IndicatorResults.vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const indicatorStore = useIndicatorStore()
const priceDataStore = usePriceDataStore()
const { t: $t } = useI18n()

const activeTab = ref('upload')
const calculating = ref(false)
const uploadData = ref('')
const uploadParameters = reactive<Record<string, any>>({})
const systemParameters = reactive<Record<string, any>>({})
const calculationResult = ref<any>(null)

const systemForm = reactive({
  pairId: null as number | null,
  timeframeId: null as number | null,
  startTime: null as Date | null,
  endTime: null as Date | null
})

const indicator = computed(() => indicatorStore.currentIndicator)

const calculateWithUploadData = async () => {
  if (!indicator.value) return
  
  try {
    // 验证JSON格式
    if (!uploadData.value.trim()) {
      ElMessage.error($t('indicators.priceDataRequired'))
      return
    }
    
    if (!validateJSON(uploadData.value)) {
      ElMessage.error($t('indicators.invalidPriceDataFormat'))
      return
    }
    
    calculating.value = true
    const priceData = JSON.parse(uploadData.value)
    
    const result = await indicatorApi.calculate(indicator.value.id!, {
      priceData,
      parameters: uploadParameters
    })
    
    calculationResult.value = result
    ElMessage.success($t('indicators.calculationCompleted'))
  } catch (error) {
    console.error(`${$t('common.calculationFailed')}:`, error)
    ElMessage.error($t('common.calculationFailed'))
  } finally {
    calculating.value = false
  }
}

const calculateWithSystemData = async () => {
  if (!indicator.value) return
  
  try {
    if (!systemForm.pairId || !systemForm.timeframeId || !systemForm.startTime || !systemForm.endTime) {
      ElMessage.error(t('indicators.fullCalculationParamsRequired'))
      return
    }
    
    calculating.value = true
    
    const result = await indicatorApi.calculateWithData(indicator.value.id!, {
      pairId: systemForm.pairId,
      timeframeId: systemForm.timeframeId,
      startTime: systemForm.startTime.getTime(),
      endTime: systemForm.endTime.getTime(),
      parameters: systemParameters
    })
    
    calculationResult.value = result
    ElMessage.success(t('indicators.calculationCompleted'))
  } catch (error) {
    console.error(`${t('common.calculationFailed')}:`, error)
    ElMessage.error(t('common.calculationFailed'))
  } finally {
    calculating.value = false
  }
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (id) {
    await indicatorStore.fetchIndicatorById(id)
    
    // 初始化参数默认值
    if (indicator.value) {
      indicator.value.parameters.forEach(param => {
        uploadParameters[param.name] = param.defaultValue || ''
        systemParameters[param.name] = param.defaultValue || ''
      })
    }
  }
  
  // 加载基础数据
  await Promise.all([
    priceDataStore.fetchTradingPairs(),
    priceDataStore.fetchTimeframes()
  ])
})
</script>