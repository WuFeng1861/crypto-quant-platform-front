# AI指标生成器接口适配修改计划

## 概述

根据后端接口变化文档，需要修改前端代码以适配新的接口响应格式。

---

## 变更影响分析

### 接口变更摘要

| 接口 | 变更内容 |
|------|---------|
| `/ai-indicator-generator/generate` | `type` → `paramType`，`defaultValue` 类型 number → string，新增 `description` |
| `/ai-indicator-generator/create` | 移除顶层 `parameters`，新增错误码 400/409 |

---

## 修改任务清单

### 任务1: 更新 API 类型定义

**文件**: [src/api/aiIndicator.ts](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\api\aiIndicator.ts)

**修改内容**:

```typescript
// 修改前
export interface AIGenerateIndicatorResponse {
  success: boolean
  generatedCode: {
    code: string
    parameters: Array<{
      name: string
      type: string
      defaultValue: any
      description: string
    }>
  }
}

// 修改后
export interface AIGenerateIndicatorResponse {
  success: boolean
  generatedCode: {
    code: string
    parameters: Array<{
      name: string
      paramType: string
      defaultValue: string
      description: string
    }>
  }
}
```

---

### 任务2: 更新组件中的字段访问

**文件**: [src/views/Indicators/Create.vue](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\views\Indicators\Create.vue)

**修改内容**:

```typescript
// 修改前
response.generatedCode.parameters.forEach((param: any) => {
  form.parameters.push({
    name: param.name,
    paramType: param.type,
    defaultValue: param.defaultValue,
    description: param.description
  })
})

// 修改后
response.generatedCode.parameters.forEach((param: any) => {
  form.parameters.push({
    name: param.name,
    paramType: param.paramType,
    defaultValue: param.defaultValue,
    description: param.description
  })
})
```

---

### 任务3: 更新全局类型定义

**文件**: [src/types/index.ts](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\types\index.ts)

**修改内容**:

```typescript
// 修改前
export interface IndicatorParameter {
  id?: number
  name: string
  description?: string
  defaultValue?: string
  paramType: 'number' | 'string' | 'boolean'
}

// 修改后 - defaultValue 类型保持 string（已正确）
// 无需修改，当前定义已符合新接口
```

---

### 任务4: 添加新错误码处理

**文件**: [src/api/index.ts](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\api\index.ts)

**修改内容**:

```typescript
// 在响应拦截器的错误处理中添加 409 状态码
switch (status) {
  case 400: message = data?.message || '请求参数错误'; break
  case 401: message = '未授权，请重新登录'; break
  case 403: message = '拒绝访问'; break
  case 404: message = '请求的资源不存在'; break
  case 409: message = data?.message || '资源冲突'; break  // 新增
  case 500: message = '服务器内部错误'; break
  default: message = data?.message || `请求失败 (${status})`
}
```

---

### 任务5: 检查 defaultValue 类型转换

**相关文件**:
- [src/views/Indicators/Detail.vue](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\views\Indicators\Detail.vue)
- [src/components/Indicator/IndicatorCalculation.vue](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\components\Indicator\IndicatorCalculation.vue)
- [src/components/Strategy/StrategyIndicators.vue](file:///c:\Users\WuFeng\Desktop\project\AiTest\codebuddy-ai\crypto-quant-platform-front\src\components\Strategy\StrategyIndicators.vue)

**分析**: 这些文件中 `defaultValue` 主要用于：
1. 作为输入框的 placeholder
2. 初始化参数默认值

由于 `defaultValue` 现在是 string 类型，而这些用法本身就是字符串操作，无需修改。

---

## 修改文件汇总

| 文件 | 修改类型 | 优先级 |
|------|---------|--------|
| `src/api/aiIndicator.ts` | 类型定义更新 | 高 |
| `src/views/Indicators/Create.vue` | 字段名修改 | 高 |
| `src/api/index.ts` | 新增错误码处理 | 中 |

---

## 验证步骤

1. 运行 TypeScript 类型检查确保无类型错误
2. 测试 AI 生成指标功能，验证参数正确显示
3. 测试错误场景（名称冲突、输入过长等）
