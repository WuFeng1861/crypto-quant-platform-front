<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ indicator?.name || '指标详情' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看和计算指标
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
        title="指标不存在"
        description="请检查指标ID是否正确"
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
          计算代码
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
          指标计算
        </h3>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="上传数据计算" name="upload">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  价格数据 (JSON格式)
                </label>
                <el-input
                  v-model="uploadData"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入价格数据的JSON格式..."
                />
              </div>
              
              <!-- 参数设置 -->
              <div v-if="indicator.parameters && indicator.parameters.length > 0">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参数设置</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="param in indicator.parameters || []" :key="param.name">
                    <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {{ param.name }}
                    </label>
                    <el-input
                      v-model="uploadParameters[param.name]"
                      :placeholder="param.defaultValue || `请输入${param.name}`"
                    />
                  </div>
                </div>
              </div>
              
              <el-button
                type="primary"
                @click="calculateWithUploadData"
                :loading="calculating"
              >
                计算指标
              </el-button>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="系统数据计算" name="system">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    交易对
                  </label>
                  <el-select v-model="systemForm.pairId" placeholder="选择交易对" class="w-full">
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
                    时间框架
                  </label>
                  <el-select v-model="systemForm.timeframeId" placeholder="选择时间框架" class="w-full">
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
                    开始时间
                  </label>
                  <el-date-picker
                    v-model="systemForm.startTime"
                    type="datetime"
                    placeholder="选择开始时间"
                    class="w-full"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    结束时间
                  </label>
                  <el-date-picker
                    v-model="systemForm.endTime"
                    type="datetime"
                    placeholder="选择结束时间"
                    class="w-full"
                  />
                </div>
              </div>
              
              <!-- 参数设置 -->
              <div v-if="indicator.parameters && indicator.parameters.length > 0">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参数设置</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="param in indicator.parameters || []" :key="param.name">
                    <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {{ param.name }}
                    </label>
                    <el-input
                      v-model="systemParameters[param.name]"
                      :placeholder="param.defaultValue || `请输入${param.name}`"
                    />
                  </div>
                </div>
              </div>
              
              <el-button
                type="primary"
                @click="calculateWithSystemData"
                :loading="calculating"
              >
                计算指标
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
        
        <!-- 计算结果 -->
        <div v-if="calculationResult" class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">计算结果</h4>
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

const route = useRoute()
const indicatorStore = useIndicatorStore()
const priceDataStore = usePriceDataStore()

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
      ElMessage.error('请输入价格数据')
      return
    }
    
    if (!validateJSON(uploadData.value)) {
      ElMessage.error('价格数据格式不正确，请输入有效的JSON')
      return
    }
    
    calculating.value = true
    const priceData = JSON.parse(uploadData.value)
    
    const result = await indicatorApi.calculate(indicator.value.id!, {
      priceData,
      parameters: uploadParameters
    })
    
    calculationResult.value = result
    ElMessage.success('指标计算完成')
  } catch (error) {
    console.error('计算失败:', error)
    ElMessage.error('计算失败')
  } finally {
    calculating.value = false
  }
}

const calculateWithSystemData = async () => {
  if (!indicator.value) return
  
  try {
    if (!systemForm.pairId || !systemForm.timeframeId || !systemForm.startTime || !systemForm.endTime) {
      ElMessage.error('请填写完整的计算参数')
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
    ElMessage.success('指标计算完成')
  } catch (error) {
    console.error('计算失败:', error)
    ElMessage.error('计算失败')
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