<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('strategies.edit') }}
        </h1>
        <p class="page-subtitle">
          {{ $t('common.editStrategyConfig') }}
        </p>
      </div>
      <div class="flex space-x-2">
        <router-link to="/strategies">
          <el-button :icon="ArrowLeft">
            {{ $t('common.backToList') }}
          </el-button>
        </router-link>
        <el-button @click="resetForm" :icon="Refresh">
          {{ $t('common.reset') }}
        </el-button>
      </div>
    </div>

    <!-- 编辑表单 -->
    <div class="card p-6" v-loading="loading">
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
              :loading="submitLoading"
            >
              {{ $t('common.saveChanges') }}
            </el-button>
            <el-button @click="resetForm">
              {{ $t('common.resetForm') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance } from 'element-plus'
import { useStrategyStore } from '@/stores/strategies'
import { useIndicatorStore } from '@/stores/indicators'
import { validationRules } from '@/utils/validation'
import { ArrowLeft, Refresh } from '@element-plus/icons-vue'
import StrategyBasicInfo from '@/components/Strategy/StrategyBasicInfo.vue'
import StrategyRiskManagement from '@/components/Strategy/StrategyRiskManagement.vue'
import StrategyIndicators from '@/components/Strategy/StrategyIndicators.vue'
import StrategyConditions from '@/components/Strategy/StrategyConditions.vue'
import type { UpdateStrategyRequest } from '@/types'

const route = useRoute()
const router = useRouter()
const { t: $t } = useI18n()
const strategyStore = useStrategyStore()
const indicatorStore = useIndicatorStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const submitLoading = ref(false)
const strategyId = computed(() => Number(route.params.id))

const form = reactive<UpdateStrategyRequest>({
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
          callback(new Error($t('validation.takeProfitRatioError')))
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
          callback(new Error($t('validation.stopLossRatioError')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}



const loadStrategy = async () => {
  loading.value = true
  try {
    const strategy = await strategyStore.fetchStrategyWithDetails(strategyId.value)

    // 填充表单数据
    Object.assign(form, {
      name: strategy.name,
      description: strategy.description || '',
      positionType: strategy.positionType,
      buyFee: Number(strategy.buyFee),
      sellFee: Number(strategy.sellFee),
      liquidationThreshold: Number(strategy.liquidationThreshold),
      takeProfitRatio: strategy.takeProfitRatio || undefined,
      stopLossRatio: strategy.stopLossRatio || undefined,
      indicators: strategy.indicators?.map(ind => ({
        id: ind.id,
        indicatorId: ind.indicatorId,
        priority: ind.priority,
        parameters: ind.parameters || []
      })) || [],
      conditions: strategy.conditions?.map(cond => ({
        id: cond.id,
        indicatorIndex: cond.indicatorIndex,
        comparisonType: cond.comparisonType,
        operator: cond.operator,
        conditionType: cond.conditionType,
        action: cond.action,
        priority: cond.priority,
        group: cond.group || 1,
        currentValuePath: cond.currentValuePath || '',
        constantValue: cond.constantValue || '',
        comparedIndicatorIndex: cond.comparedIndicatorIndex,
        comparedValuePath: cond.comparedValuePath || '',
        customCode: cond.customCode || ''
      })) || []
    })
  } catch (error) {
    ElMessage.error(`${$t('strategies.title')}${$t('common.loadFailed')}`)
    router.push('/strategies')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  loadStrategy()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (!form.indicators || form.indicators.length === 0) {
      ElMessage.error($t('common.atLeastOneIndicator'))
      return
    }

    if (!form.conditions || form.conditions.length === 0) {
      ElMessage.error($t('common.atLeastOneCondition'))
      return
    }

    submitLoading.value = true
    await strategyStore.updateStrategy(strategyId.value, form)
    ElMessage.success(`${$t('strategies.title')}${$t('common.updateSuccess')}`);
    router.push('/strategies')
  } catch (error) {
    console.error(`${$t('strategies.edit')}${$t('common.updateFailed')}:`, error)
    ElMessage.error(`${$t('strategies.edit')}${$t('common.updateFailed')}`)
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  await indicatorStore.fetchIndicators()
  await loadStrategy()
})
</script>
