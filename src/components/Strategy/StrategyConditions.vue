<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium theme-text-primary">交易条件</h3>
      <el-button type="primary" plain @click="addCondition" :icon="Plus">
        {{ $t('strategies.addCondition') }}
      </el-button>
    </div>

    <!-- 条件逻辑说明 -->
    <div v-if="form.conditions.length > 1" class="mb-4 info-box info-box-blue">
      <h4 class="info-box-title info-box-title-blue">条件逻辑说明</h4>
      <p class="info-box-text info-box-text-blue mb-2">
        • 同一分组内的条件使用 <strong>AND</strong> 逻辑（所有条件都必须满足）
      </p>
      <p class="info-box-text info-box-text-blue">
        • 不同分组间使用 <strong>OR</strong> 逻辑（任一分组满足即可）
      </p>
    </div>

    <div v-if="form.conditions.length === 0" class="text-center py-8 theme-text-secondary">
      暂未添加交易条件，请点击上方按钮添加
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(condition, index) in form.conditions"
        :key="index"
        class="theme-card p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-medium theme-text-primary">
            条件 {{ index + 1 }} (分组 {{ condition.group || 1 }})
            <span v-if="condition.id" class="text-xs theme-text-secondary">(ID: {{ condition.id }})</span>
          </h4>
          <el-button
            size="small"
            type="danger"
            link
            @click="removeCondition(index)"
          >
            移除
          </el-button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <el-form-item label="条件类型">
            <el-select v-model="condition.conditionType" placeholder="条件类型" class="w-full">
              <el-option label="数值条件" value="value" />
              <el-option label="交叉条件" value="crossover" />
              <el-option label="自定义代码" value="custom" />
            </el-select>
          </el-form-item>

          <el-form-item label="执行动作">
            <el-select v-model="condition.action" placeholder="选择动作" class="w-full">
              <el-option label="买入" value="buy" />
              <el-option label="卖出" value="sell" />
              <el-option label="无操作" value="none" />
            </el-select>
          </el-form-item>

          <el-form-item label="条件分组">
            <el-input-number 
              v-model="condition.group" 
              :min="1" 
              :max="10"
              placeholder="分组编号"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="优先级">
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
            <el-form-item label="指标索引">
              <el-select v-model="condition.indicatorIndex" placeholder="选择指标" class="w-full">
                <el-option
                  v-for="(ind, idx) in form.indicators"
                  :key="idx"
                  :label="`指标${idx + 1}`"
                  :value="idx"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="比较类型">
              <el-select v-model="condition.comparisonType" placeholder="比较类型" class="w-full">
                <el-option label="与指标比较" value="indicator" />
                <el-option label="与常量比较" value="constant" />
              </el-select>
            </el-form-item>

            <el-form-item label="操作符">
              <el-select v-model="condition.operator" placeholder="选择操作符" class="w-full">
                <el-option label="大于 >" value=">" />
                <el-option label="小于 <" value="<" />
                <el-option label="大于等于 >=" value=">=" />
                <el-option label="小于等于 <=" value="<=" />
                <el-option label="等于 ==" value="==" />
                <el-option label="不等于 !=" value="!=" />
              </el-select>
            </el-form-item>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <el-form-item v-if="condition.comparisonType === 'indicator'" label="比较指标">
              <el-select v-model="condition.comparedIndicatorIndex" placeholder="选择指标" class="w-full">
                <el-option
                  v-for="(ind, idx) in form.indicators"
                  :key="idx"
                  :label="`指标${idx + 1}`"
                  :value="idx"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-if="condition.comparisonType === 'constant'" label="常量值">
              <el-input v-model="condition.constantValue" placeholder="输入常量值" />
            </el-form-item>
          </div>
        </template>

        <!-- 自定义代码配置 - 只在自定义代码模式下显示 -->
        <template v-if="condition.conditionType === 'custom'">
          <div class="mb-4 info-box info-box-yellow">
            <h5 class="info-box-title info-box-title-yellow">自定义代码说明</h5>
            <p class="info-box-text info-box-text-yellow mb-1">
              • 使用 JavaScript 编写自定义交易条件逻辑
            </p>
            <p class="info-box-text info-box-text-yellow mb-1">
              • 可访问变量：indicators（指标数组）、price（当前价格）、volume（成交量）
            </p>
            <p class="info-box-text info-box-text-yellow">
              • 返回 true 表示条件满足，false 表示条件不满足
            </p>
          </div>

          <div class="mt-4">
            <el-form-item label="自定义代码" class="w-full">
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
    comparisonType: 'constant',
    operator: '>',
    conditionType: 'value',
    action: 'buy',
    priority: 1,
    group: 1,
    currentValuePath: '',
    constantValue: '',
    customCode: ''
  })
}

const removeCondition = (index: number) => {
  props.form.conditions.splice(index, 1)
}
</script>