<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium theme-text-primary">{{ $t('strategies.tradingConditions') }}</h3>
      <el-button type="primary" plain @click="addCondition" :icon="Plus">
        {{ $t('strategies.addCondition') }}
      </el-button>
    </div>

    <!-- 条件逻辑说明 -->
    <div v-if="form.conditions.length > 1" class="mb-4 info-box info-box-blue">
      <h4 class="info-box-title info-box-title-blue">{{ $t('strategies.conditionLogicTitle') }}</h4>
      <p class="info-box-text info-box-text-blue mb-2">
        • {{ $t('strategies.conditionLogicAnd') }}
      </p>
      <p class="info-box-text info-box-text-blue">
        • {{ $t('strategies.conditionLogicOr') }}
      </p>
    </div>

    <div v-if="!form.conditions || form.conditions.length === 0" class="text-center py-8 theme-text-secondary">
      {{ $t('strategies.noConditionsText') }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(condition, index) in form.conditions"
        :key="index"
        class="theme-card p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-medium theme-text-primary">
            {{ $t('strategies.conditionNumber') }} {{ index + 1 }} ({{ $t('strategies.conditionGroup') }} {{ condition.group || 1 }})
            <span v-if="'id' in condition && condition.id" class="text-xs theme-text-secondary">(ID: {{ condition.id }})</span>
          </h4>
          <el-button
            size="small"
            type="danger"
            link
            @click="removeCondition(index)"
          >
            {{ $t('strategies.removeCondition') }}
          </el-button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <el-form-item :label="$t('strategies.conditionType')">
            <el-select v-model="condition.conditionType" :placeholder="$t('strategies.conditionType')" class="w-full">
              <el-option :label="$t('strategies.conditionTypes.value')" value="value" />
              <el-option :label="$t('strategies.conditionTypes.crossover')" value="crossover" />
              <el-option :label="$t('strategies.conditionTypes.custom')" value="custom" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('strategies.executeAction')">
            <el-select v-model="condition.action" :placeholder="$t('strategies.selectAction')" class="w-full">
              <el-option :label="$t('strategies.actions.buy')" value="buy" />
              <el-option :label="$t('strategies.actions.sell')" value="sell" />
              <el-option :label="$t('strategies.actions.none')" value="none" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('strategies.conditionGroupLabel')">
            <el-input-number 
              v-model="condition.group" 
              :min="1" 
              :max="10"
              :placeholder="$t('strategies.groupNumber')"
              class="w-full"
            />
          </el-form-item>

          <el-form-item :label="$t('strategies.priority')">
            <el-input-number 
              v-model="condition.priority" 
              :min="1" 
              :max="100"
              class="w-full"
            />
          </el-form-item>
        </div>

        <!-- 标准条件配置 - 只在非自定义代码模式下显示 -->
        <template v-if="condition.conditionType !== 'custom'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <el-form-item :label="$t('strategies.indicatorIndex')">
              <el-select v-model="condition.indicatorIndex" :placeholder="$t('strategies.selectIndicator')" class="w-full">
                <el-option
                  v-for="(ind, idx) in form.indicators"
                  :key="idx"
                  :label="`${$t('strategies.selectIndicator')}${idx + 1}`"
                  :value="idx"
                />
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('strategies.comparisonType')">
              <el-select v-model="condition.comparisonType" :placeholder="$t('strategies.comparisonType')" class="w-full">
                <el-option :label="$t('strategies.comparisonTypes.indicator')" value="indicator" />
                <el-option :label="$t('strategies.comparisonTypes.constant')" value="constant" />
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('strategies.operator')">
              <el-select v-model="condition.operator" :placeholder="$t('strategies.operator')" class="w-full">
                <el-option :label="`${$t('strategies.operators.>')} >`" value=">" />
                <el-option :label="`${$t('strategies.operators.<')} <`" value="<" />
                <el-option :label="`${$t('strategies.operators.>=')} >=`" value=">=" />
                <el-option :label="`${$t('strategies.operators.<=')} <=`" value="<=" />
                <el-option :label="`${$t('strategies.operators.==')} ==`" value="==" />
                <el-option :label="`${$t('strategies.operators.!=')} !=`" value="!=" />
              </el-select>
            </el-form-item>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <el-form-item v-if="condition.comparisonType === 'indicator'" :label="$t('strategies.comparedIndicator')">
              <el-select v-model="condition.comparedIndicatorIndex" :placeholder="$t('strategies.selectIndicator')" class="w-full">
                <el-option
                  v-for="(ind, idx) in form.indicators"
                  :key="idx"
                  :label="`${$t('strategies.selectIndicator')}${idx + 1}`"
                  :value="idx"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-if="condition.comparisonType === 'constant'" :label="$t('strategies.constantValue')">
              <el-input v-model="condition.constantValue" :placeholder="$t('strategies.inputConstantValue')" />
            </el-form-item>
          </div>
        </template>

        <!-- 自定义代码配置 - 只在自定义代码模式下显示 -->
        <template v-if="condition.conditionType === 'custom'">
          <div class="mb-4 info-box info-box-yellow">
            <h5 class="info-box-title info-box-title-yellow">{{ $t('strategies.customCodeTitle') }}</h5>
            <p class="info-box-text info-box-text-yellow mb-1">
              • {{ $t('strategies.customCodeTip1') }}
            </p>
            <p class="info-box-text info-box-text-yellow mb-1">
              • {{ $t('strategies.customCodeTip2') }}
            </p>
            <p class="info-box-text info-box-text-yellow">
              • {{ $t('strategies.customCodeTip3') }}
            </p>
          </div>

          <div class="mt-4">
            <el-form-item :label="$t('strategies.customCodeLabel')" class="w-full">
              <CodeEditor
                v-model="condition.customCode"
                placeholder="// 示例：当 RSI 小于 30 且价格上涨时买入
if (indicators[0] && indicators[0].value < 30 && price > indicators[1].value) {
  return true;
}
return false;"
                language="javascript"
                :readonly="false"
              />
            </el-form-item>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { watch } from 'vue'
import CodeEditor from '@/components/Common/CodeEditor.vue'
import type { CreateStrategyRequest, UpdateStrategyRequest } from '@/types'

interface Props {
  form: CreateStrategyRequest | UpdateStrategyRequest
}

const props = defineProps<Props>()

// 监听条件类型变化，清空不相关字段
watch(
  () => props.form.conditions,
  (conditions) => {
    if (conditions) {
      conditions.forEach((condition) => {
        if (condition.conditionType === 'custom') {
          // 切换到自定义代码模式时，清空标准条件字段
          condition.indicatorIndex = undefined
          condition.comparisonType = undefined
          condition.operator = undefined
          condition.comparedIndicatorIndex = undefined
          condition.constantValue = undefined
        } else {
          // 切换到标准条件模式时，清空自定义代码
          if (!condition.customCode) {
            condition.customCode = ''
          }
        }
      })
    }
  },
  { deep: true }
)

const addCondition = () => {
  if (!props.form.conditions) {
    props.form.conditions = []
  }
  
  props.form.conditions.push({
    indicatorIndex: 0,
    comparisonType: 'constant' as const,
    operator: '>' as const,
    conditionType: 'value' as const,
    action: 'buy' as const,
    priority: 1,
    group: 1,
    currentValuePath: '',
    constantValue: '',
    customCode: ''
  })
}

const removeCondition = (index: number) => {
  if (props.form.conditions) {
    props.form.conditions.splice(index, 1)
  }
}
</script>