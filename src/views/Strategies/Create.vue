<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('strategies.create') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('common.createNewStrategy') }}
        </p>
      </div>
      <router-link to="/strategies">
        <el-button :icon="ArrowLeft">
          {{ $t('common.back') }}
        </el-button>
      </router-link>
    </div>

    <!-- 创建表单 -->
    <div class="card p-6">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <!-- 基本信息 -->
        <StrategyBasicInfo :form="form" />

        <!-- 风险管理 -->
        <StrategyRiskManagement :form="form" />

        <!-- 指标配置 -->
        <StrategyIndicators :form="form" />

        <!-- 交易条件 -->
        <StrategyConditions :form="form" />

        <el-form-item>
          <div class="flex space-x-4">
            <el-button
              type="primary"
              @click="handleSubmit"
              :loading="loading"
            >
              {{ $t('common.create') }}
            </el-button>
            <el-button @click="resetForm">
              {{ $t('common.reset') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance } from 'element-plus'
import { useStrategyStore } from '@/stores/strategies'
import { useIndicatorStore } from '@/stores/indicators'
import { validationRules } from '@/utils/validation'
import { ArrowLeft } from '@element-plus/icons-vue'
import StrategyBasicInfo from '@/components/Strategy/StrategyBasicInfo.vue'
import StrategyRiskManagement from '@/components/Strategy/StrategyRiskManagement.vue'
import StrategyIndicators from '@/components/Strategy/StrategyIndicators.vue'
import StrategyConditions from '@/components/Strategy/StrategyConditions.vue'
import type { CreateStrategyRequest } from '@/types'

const router = useRouter()
const { t } = useI18n()
const strategyStore = useStrategyStore()
const indicatorStore = useIndicatorStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<CreateStrategyRequest>({
  name: '',
  description: '',
  positionType: 'long',
  buyFee: 0.001,
  sellFee: 0.001,
  liquidationThreshold: 10,
  takeProfitRatio: undefined,
  stopLossRatio: undefined,
  indicators: [],
  conditions: []
})

const rules = {
  name: [validationRules.required(), validationRules.maxLength(100)],
  positionType: [validationRules.required()],
  buyFee: [validationRules.required(), validationRules.range(0, 1)],
  sellFee: [validationRules.required(), validationRules.range(0, 1)],
  liquidationThreshold: [validationRules.required(), validationRules.range(0, 100)],
  takeProfitRatio: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === undefined || value === null || value === '') {
          callback() // Optional field, allow empty
        } else if (value <= 100) {
          callback(new Error(t('validation.takeProfitRatioError')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  stopLossRatio: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === undefined || value === null || value === '') {
          callback() // Optional field, allow empty
        } else if (value <= 0 || value >= 100) {
          callback(new Error(t('validation.stopLossRatioError')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.indicators = []
  form.conditions = []
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.indicators.length === 0) {
      ElMessage.error(t('common.atLeastOneIndicator'))
      return
    }
    
    if (form.conditions.length === 0) {
      ElMessage.error(t('common.atLeastOneCondition'))
      return
    }
    
    loading.value = true
    await strategyStore.createStrategy(form)
    ElMessage.success(`${t('strategies.title')}${t('common.createSuccess')}`)
    router.push('/strategies')
  } catch (error) {
    console.error(`${t('strategies.create')}${t('common.createFailed')}:`, error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  indicatorStore.fetchIndicators()
})
</script>