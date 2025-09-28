# 策略管理 CRUD 功能实现

## 概述

本项目已完整实现了策略管理系统的CRUD功能，包括策略、指标和条件的创建、读取、更新和删除操作。

## 功能特性

### ✅ 已实现功能

1. **策略基础操作**
   - ✅ 创建策略 (POST /strategies)
   - ✅ 获取所有策略 (GET /strategies)
   - ✅ 获取策略详情 (GET /strategies/with-details/{id})
   - ✅ 更新策略 (PUT /strategies/{id})
   - ✅ 删除策略 (DELETE /strategies/{id})

2. **指标管理**
   - ✅ 获取策略指标 (GET /strategies/{id}/indicators)
   - ✅ 更新策略指标 (PUT /strategies/{strategyId}/indicators/{indicatorId})
   - ✅ 删除策略指标 (DELETE /strategies/{strategyId}/indicators/{indicatorId})

3. **条件管理**
   - ✅ 更新策略条件 (PUT /strategies/{strategyId}/conditions/{conditionId})
   - ✅ 删除策略条件 (DELETE /strategies/{strategyId}/conditions/{conditionId})

4. **前端界面**
   - ✅ 策略列表页面 (`/strategies`)
   - ✅ 策略创建页面 (`/strategies/create`)
   - ✅ 策略详情页面 (`/strategies/{id}`)
   - ✅ 策略编辑页面 (`/strategies/{id}/edit`)
   - ✅ API测试页面 (`/strategies/test`)

## 文件结构

```
src/
├── api/
│   └── strategies.ts          # 策略API接口
├── types/
│   ├── index.ts              # 主类型文件
│   └── strategy.ts           # 策略相关类型定义
├── stores/
│   └── strategies.ts         # 策略状态管理
├── views/Strategies/
│   ├── index.vue            # 策略列表
│   ├── Create.vue           # 创建策略
│   ├── Detail.vue           # 策略详情
│   ├── Edit.vue             # 编辑策略
│   └── Test.vue             # API测试页面
├── components/Common/
│   └── StrategyManager.vue   # 策略管理演示组件
└── router/
    └── index.ts             # 路由配置
```

## 类型定义

### 核心类型

```typescript
// 策略基础类型
interface Strategy {
  id: number;
  name: string;
  description: string;
  positionType: 'long' | 'short' | 'both';
  buyFee: number;
  sellFee: number;
  liquidationThreshold: number;
  takeProfitRatio: number;
  stopLossRatio: number;
  createdAt: string;
  updatedAt: string;
}

// 策略详情类型（包含指标和条件）
interface StrategyWithDetails extends Strategy {
  indicators: StrategyIndicator[];
  conditions: StrategyCondition[];
}

// 创建策略请求类型
interface CreateStrategyRequest {
  name: string;
  description: string;
  positionType: 'long' | 'short' | 'both';
  buyFee: number;
  sellFee: number;
  liquidationThreshold: number;
  takeProfitRatio: number;
  stopLossRatio: number;
  indicators: StrategyIndicator[];
  conditions: StrategyCondition[];
}
```

## API 接口

### 策略操作

```typescript
// 获取所有策略
strategyApi.getAll(): Promise<Strategy[]>

// 获取所有策略详情
strategyApi.getAllWithDetails(): Promise<StrategyWithDetails[]>

// 获取单个策略
strategyApi.getById(id: number): Promise<Strategy>

// 获取策略详情
strategyApi.getWithDetails(id: number): Promise<StrategyWithDetails>

// 创建策略
strategyApi.create(data: CreateStrategyRequest): Promise<Strategy>

// 更新策略
strategyApi.update(id: number, data: UpdateStrategyRequest): Promise<Strategy>

// 删除策略
strategyApi.delete(id: number): Promise<void>
```

### 指标操作

```typescript
// 获取策略指标
strategyApi.getIndicators(strategyId: number)

// 更新策略指标
strategyApi.updateIndicator(strategyId: number, indicatorId: number, data: UpdateIndicatorRequest)

// 删除策略指标
strategyApi.deleteIndicator(strategyId: number, indicatorId: number): Promise<void>
```

### 条件操作

```typescript
// 更新策略条件
strategyApi.updateCondition(strategyId: number, conditionId: number, data: UpdateConditionRequest)

// 删除策略条件
strategyApi.deleteCondition(strategyId: number, conditionId: number): Promise<void>
```

## 使用示例

### 1. 创建策略

```typescript
const createData: CreateStrategyRequest = {
  name: "MACD交叉策略",
  description: "基于MACD指标的交叉策略",
  positionType: "both",
  buyFee: 0.001,
  sellFee: 0.001,
  liquidationThreshold: 90,
  takeProfitRatio: 120,
  stopLossRatio: 10,
  indicators: [
    {
      indicatorId: 1,
      priority: 1,
      parameters: [
        { parameterId: 1, value: "12" },
        { parameterId: 2, value: "26" }
      ]
    }
  ],
  conditions: [
    {
      indicatorIndex: 0,
      comparisonType: "indicator",
      comparedIndicatorIndex: 0,
      currentValuePath: "macd",
      comparedValuePath: "signal",
      operator: ">",
      conditionType: "crossover",
      action: "buy",
      priority: 1,
      customCode: "return indicatorValues[0].macd > indicatorValues[0].signal;"
    }
  ]
};

const strategy = await strategyApi.create(createData);
```

### 2. 更新策略

```typescript
const updateData: UpdateStrategyRequest = {
  name: "更新后的策略名称",
  description: "更新后的描述",
  buyFee: 0.002,
  indicators: [
    {
      id: 1,  // 更新现有指标
      indicatorId: 1,
      priority: 2,
      parameters: [
        { parameterId: 1, value: "14" }
      ]
    },
    {
      // 新增指标（没有id字段）
      indicatorId: 2,
      priority: 1,
      parameters: [
        { parameterId: 3, value: "20" }
      ]
    }
  ]
};

await strategyApi.update(strategyId, updateData);
```

### 3. 单独更新指标

```typescript
const indicatorUpdate: UpdateIndicatorRequest = {
  priority: 2,
  parameters: [
    { parameterId: 1, value: "14" },
    { parameterId: 2, value: "28" }
  ]
};

await strategyApi.updateIndicator(strategyId, indicatorId, indicatorUpdate);
```

## 页面功能

### 策略列表页面 (`/strategies`)
- 显示所有策略的卡片列表
- 支持搜索和筛选
- 快速操作菜单（查看、删除）
- 显示策略基本信息和统计

### 策略创建页面 (`/strategies/create`)
- 基本信息配置
- 风险管理参数设置
- 指标配置（支持多个指标）
- 交易条件配置（支持多个条件）
- 自定义代码编辑器

### 策略详情页面 (`/strategies/{id}`)
- 策略基本信息展示
- 指标列表和参数显示
- 交易条件列表
- 回测历史记录
- 编辑策略按钮

### 策略编辑页面 (`/strategies/{id}/edit`)
- 完整的策略编辑功能
- 支持添加/删除指标和条件
- 单独更新指标或条件
- 实时保存和验证

### API测试页面 (`/strategies/test`)
- 完整的CRUD操作演示
- 实时操作日志
- 交互式策略选择
- 指标和条件管理测试

## 特性说明

### 1. 更新操作规则
- **部分更新**：只需要传入需要更新的字段
- **指标更新**：
  - 有`id`字段的指标会被更新
  - 没有`id`字段的指标会被新增
  - 不在更新列表中的现有指标会被删除
- **条件更新**：
  - 有`id`字段的条件会被更新
  - 没有`id`字段的条件会被新增
  - 不在更新列表中的现有条件会被删除

### 2. 级联删除
- 删除策略时，会自动删除关联的所有指标、指标参数和条件
- 删除指标时，会自动删除关联的所有指标参数
- 所有删除操作都会清除相关的Redis缓存

### 3. 缓存管理
- 所有更新和删除操作都会自动清除相关的Redis缓存
- 确保数据的一致性和实时性

## 开发指南

### 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问页面

- 策略列表：`http://localhost:5173/strategies`
- 创建策略：`http://localhost:5173/strategies/create`
- API测试：`http://localhost:5173/strategies/test`

### 测试功能

1. 访问 `/strategies/test` 页面
2. 点击"创建测试策略"按钮创建示例策略
3. 选择策略后测试各种CRUD操作
4. 查看操作日志了解API调用结果

## 注意事项

1. **数据验证**：所有表单都包含完整的验证规则
2. **错误处理**：API调用失败时会显示友好的错误信息
3. **加载状态**：所有异步操作都有加载状态指示
4. **响应式设计**：所有页面都支持移动端访问
5. **国际化**：支持中英文切换（部分功能）

## 后续扩展

可以考虑添加以下功能：
- 策略复制功能
- 批量操作
- 策略模板
- 导入/导出功能
- 策略性能分析
- 实时策略监控

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **UI组件库**：Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **样式框架**：Tailwind CSS
- **代码编辑器**：Monaco Editor (CodeEditor组件)
- **HTTP客户端**：Axios

## 总结

本实现提供了完整的策略管理CRUD功能，包括：
- 完整的API接口封装
- 类型安全的TypeScript定义
- 用户友好的界面设计
- 完善的错误处理和加载状态
- 实时的数据同步
- 灵活的更新机制
- 详细的操作日志

所有功能都经过精心设计，确保代码的可维护性和扩展性。