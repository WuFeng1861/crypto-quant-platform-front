<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('strategies.create') }}
        </h1>
        <p class="page-subtitle">
          创建新的交易策略
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
          callback() // 可选字段，允许为空
        } else if (value <= 100) {
          callback(new Error('止盈比例必须大于100'))
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
          callback() // 可选字段，允许为空
        } else if (value <= 0 || value >= 100) {
          callback(new Error('止损比例必须在0-100之间'))
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
      ElMessage.error('请至少添加一个指标')
      return
    }
    
    if (form.conditions.length === 0) {
      ElMessage.error('请至少添加一个交易条件')
      return
    }
    
    loading.value = true
    await strategyStore.createStrategy(form)
    ElMessage.success('策略创建成功')
    router.push('/strategies')
  } catch (error) {
    console.error('创建策略失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  indicatorStore.fetchIndicators()
})
</script>