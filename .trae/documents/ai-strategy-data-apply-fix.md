# AI策略数据应用问题修复计划

## 问题分析

根据用户反馈和代码分析，存在以下问题：

### 问题1：止损比例数据未正确应用
- **现象**：后端返回 `stopLossRatio: 0.05`（表示5%），但界面显示为1%
- **原因**：
  - 后端返回的 `stopLossRatio` 是小数形式（0.05 = 5%）
  - `StrategyRiskManagement.vue` 中的输入框期望整数百分比（1-99）
  - `applyGeneratedData` 函数直接赋值，未进行单位转换

### 问题2：指标下拉框只显示ID而非名称
- **现象**：指标配置选择指标下拉框应用的是指标的id，没有展示指标的名称
- **原因**：`StrategyIndicators.vue` 中的下拉框选项只显示 `ind.name`，未包含ID信息

---

## 修复方案

### 修复1：止损比例单位转换

**文件**：`src/views/Strategies/Create.vue`

在 `applyGeneratedData` 函数中，需要将后端返回的小数形式转换为百分比整数：

```typescript
// 修改前
form.stopLossRatio = data.stopLossRatio || undefined

// 修改后
// stopLossRatio: 后端返回小数形式(0.05=5%)，界面需要整数百分比(5)
if (data.stopLossRatio !== null && data.stopLossRatio !== undefined) {
  form.stopLossRatio = Math.round(data.stopLossRatio * 100)
} else {
  form.stopLossRatio = undefined
}

// takeProfitRatio 同样处理
if (data.takeProfitRatio !== null && data.takeProfitRatio !== undefined) {
  form.takeProfitRatio = Math.round(data.takeProfitRatio * 100)
} else {
  form.takeProfitRatio = undefined
}
```

### 修复2：指标下拉框显示优化

**文件**：`src/components/Strategy/StrategyIndicators.vue`

修改下拉框选项，显示格式为 "指标名称 (ID: 指标ID)"：

```vue
<!-- 修改前 -->
<el-option
  v-for="ind in indicatorStore.indicators"
  :key="ind.id"
  :label="ind.name"
  :value="ind.id!"
/>

<!-- 修改后 -->
<el-option
  v-for="ind in indicatorStore.indicators"
  :key="ind.id"
  :label="`${ind.name} (ID: ${ind.id})`"
  :value="ind.id!"
/>
```

---

## 任务清单

1. [ ] 修改 `src/views/Strategies/Create.vue` 中的 `applyGeneratedData` 函数
   - 添加 `stopLossRatio` 单位转换（小数 → 百分比整数）
   - 添加 `takeProfitRatio` 单位转换（小数 → 百分比整数）

2. [ ] 修改 `src/components/Strategy/StrategyIndicators.vue` 中的下拉框选项
   - 更新显示格式为 "指标名称 (ID: 指标ID)"

3. [ ] 测试验证
   - 验证AI生成策略后止损比例正确显示
   - 验证指标下拉框正确显示名称和ID
