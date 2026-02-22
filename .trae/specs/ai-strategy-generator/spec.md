# AI策略生成器前端对接 Spec

## Why
对接后端 AI 策略生成功能，让用户能够通过自然语言描述自动生成量化交易策略，降低策略开发门槛，提高开发效率。

## What Changes
- 新增 AI 策略生成 API 模块
- 在策略创建页面添加 AI 生成功能入口
- 展示 AI 生成的策略数据（指标、条件等）并支持编辑
- 支持保存生成的策略到数据库

## Impact
- Affected specs: 策略创建流程
- Affected code:
  - `src/api/aiStrategy.ts` - 新增 API 模块
  - `src/views/Strategies/Create.vue` - 添加 AI 生成入口
  - `src/components/Strategy/` - 展示 AI 生成数据
  - `src/types/index.ts` - 新增类型定义

---

## ADDED Requirements

### Requirement: AI 策略生成 API
系统 SHALL 提供 AI 策略生成 API 调用能力。

#### Scenario: 生成策略预览
- **WHEN** 用户输入策略描述并点击生成按钮
- **THEN** 调用 `/ai-strategy-generator/generate` 接口，返回生成的策略数据

#### Scenario: 创建并保存策略
- **WHEN** 用户确认生成的策略并点击保存
- **THEN** 调用 `/ai-strategy-generator/create` 接口，创建策略和指标

---

### Requirement: AI 生成入口
系统 SHALL 在策略创建页面提供 AI 生成入口。

#### Scenario: 显示 AI 生成按钮
- **WHEN** 用户进入策略创建页面
- **THEN** 显示 AI 生成按钮和输入框

#### Scenario: 输入验证
- **WHEN** 用户输入策略描述
- **THEN** 验证输入长度不超过 5000 字符

---

### Requirement: 策略数据展示
系统 SHALL 完整展示 AI 生成的策略数据。

#### Scenario: 展示基本信息
- **WHEN** AI 生成成功
- **THEN** 展示策略名称、描述、持仓类型、手续费等基本信息

#### Scenario: 展示指标信息
- **WHEN** AI 生成成功
- **THEN** 展示生成的指标列表，包含指标名称、描述、参数

#### Scenario: 展示条件信息
- **WHEN** AI 生成成功
- **THEN** 展示买卖条件列表，包含条件类型、操作符、动作等

---

### Requirement: 数据可编辑
系统 SHALL 允许用户编辑 AI 生成的策略数据。

#### Scenario: 编辑基本信息
- **WHEN** 用户修改策略名称或描述
- **THEN** 更新表单数据

#### Scenario: 编辑指标参数
- **WHEN** 用户修改指标参数值
- **THEN** 更新指标配置

#### Scenario: 编辑交易条件
- **WHEN** 用户修改买卖条件
- **THEN** 更新条件配置

---

### Requirement: 策略保存
系统 SHALL 支持保存 AI 生成的策略。

#### Scenario: 保存策略
- **WHEN** 用户点击保存按钮
- **THEN** 调用创建接口，保存策略和关联指标

#### Scenario: 保存成功提示
- **WHEN** 策略保存成功
- **THEN** 显示成功提示并跳转到策略列表

---

### Requirement: 错误处理
系统 SHALL 正确处理 AI 生成过程中的错误。

#### Scenario: 输入为空
- **WHEN** 用户未输入描述就点击生成
- **THEN** 显示"请输入策略描述"提示

#### Scenario: 输入过长
- **WHEN** 用户输入超过 5000 字符
- **THEN** 显示"输入内容过长"提示

#### Scenario: 名称冲突
- **WHEN** 策略名称已存在
- **THEN** 显示"策略名称已存在"提示

#### Scenario: AI 调用失败
- **WHEN** AI 服务不可用
- **THEN** 显示"AI 生成失败，请稍后重试"提示
