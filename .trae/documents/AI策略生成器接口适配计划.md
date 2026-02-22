# AI策略生成器接口适配计划

## 概述

根据 AI 策略生成器接口变更文档 (v2)，需要更新前端代码以适配新的接口响应格式。主要变更包括指标写入数据库、返回完整指标信息和 ID，以及移除 `indicatorNews` 字段。

---

## 变更分析

### 主要变更

| 变更项 | 变更前 | 变更后 |
|-------|-------|-------|
| 指标写入数据库 | ❌ 不写入 | ✅ 写入数据库 |
| 返回指标ID | ❌ 无ID | ✅ 包含数据库ID |
| `indicatorNews` 字段 | ✅ 存在 | ❌ 移除 |
| `indicators` 字段 | 只有索引 | 包含完整指标信息 + ID |
| `createdIndicators` 字段 | ❌ 不存在 | ✅ 新增 |

### 影响范围

- **TypeScript 类型定义**: 需要更新响应类型
- **API 调用逻辑**: 需要处理新的响应格式
- **UI 展示**: 需要更新预览对话框
- **数据应用**: 需要更新应用生成数据到表单的逻辑

---

## 修改任务

### [x] Task 1: 更新 TypeScript 类型定义
- **Priority**: P0
- **Depends On**: None
- **Description**: 更新 AI 策略生成相关的 TypeScript 类型定义，移除 `indicatorNews` 字段，添加 `createdIndicators` 字段，更新 `indicators` 结构。
- **Success Criteria**: TypeScript 类型检查通过，类型定义与新接口响应格式匹配。
- **Test Requirements**:
  - `programmatic` TR-1.1: 运行 `npm run build` 无类型错误
  - `programmatic` TR-1.2: 类型定义文件编译通过

### [x] Task 2: 修改 API 调用逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 更新策略创建页面的 API 调用逻辑，处理新的响应格式，移除对 `indicatorNews` 的依赖。
- **Success Criteria**: API 调用能够正确处理新的响应格式，数据能够正确解析。
- **Test Requirements**:
  - `programmatic` TR-2.1: 编译通过无语法错误
  - `human-judgement` TR-2.2: 代码逻辑清晰，错误处理完善

### [x] Task 3: 更新预览对话框
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 更新预览对话框的模板，移除对 `indicatorNews` 的引用，使用新的 `indicators` 字段展示指标信息，添加对 `createdIndicators` 的展示。
- **Success Criteria**: 预览对话框能够正确展示新的响应数据，包括指标详情和已创建的指标。
- **Test Requirements**:
  - `human-judgement` TR-3.1: 预览对话框显示完整的指标信息
  - `human-judgement` TR-3.2: 界面布局合理，信息清晰

### [x] Task 4: 更新数据应用逻辑
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 更新 `applyGeneratedData` 函数，使用新的 `indicators` 结构将数据应用到表单，正确处理指标 ID 和参数。
- **Success Criteria**: 生成的策略数据能够正确应用到表单，包括指标配置和条件设置。
- **Test Requirements**:
  - `human-judgement` TR-4.1: 数据应用后表单显示正确
  - `human-judgement` TR-4.2: 指标和条件配置完整

### [x] Task 5: 验证修改
- **Priority**: P1
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **Description**: 运行构建命令验证所有修改，确保无编译错误。
- **Success Criteria**: 构建成功，无类型错误。
- **Test Requirements**:
  - `programmatic` TR-5.1: `npm run build` 构建成功
  - `programmatic` TR-5.2: 无控制台错误

---

## 实施步骤

1. **更新类型定义**: 修改 `src/api/aiStrategy.ts` 和 `src/types/index.ts` 中的类型定义
2. **修改 API 调用**: 更新 `src/views/Strategies/Create.vue` 中的 API 调用逻辑
3. **更新预览对话框**: 修改预览对话框模板，使用新的字段
4. **更新数据应用**: 修改 `applyGeneratedData` 函数
5. **验证构建**: 运行构建命令确保无错误

---

## 风险评估

- **低风险**: 类型定义更新，API 调用逻辑修改
- **中风险**: 数据应用逻辑修改，需要确保指标和条件配置正确映射

---

## 预期结果

- 前端能够正确处理新的接口响应格式
- 生成的策略数据能够完整展示和应用
- 指标信息包含数据库 ID，支持后续操作
- 构建成功，无编译错误
