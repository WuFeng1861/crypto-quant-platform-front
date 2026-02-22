# Tasks

- [x] Task 1: 创建 AI 策略生成 API 模块
  - [x] SubTask 1.1: 在 src/api/aiStrategy.ts 中定义请求和响应类型
  - [x] SubTask 1.2: 实现 generate 接口调用
  - [x] SubTask 1.3: 实现 create 接口调用

- [x] Task 2: 添加类型定义
  - [x] SubTask 2.1: 在 src/types/index.ts 中添加 AI 策略相关类型定义

- [x] Task 3: 修改策略创建页面
  - [x] SubTask 3.1: 添加 AI 生成输入区域
  - [x] SubTask 3.2: 添加 AI 生成按钮和加载状态
  - [x] SubTask 3.3: 实现 AI 生成逻辑

- [x] Task 4: 实现数据展示和编辑
  - [x] SubTask 4.1: 展示生成的基本信息（名称、描述、持仓类型等）
  - [x] SubTask 4.2: 展示生成的指标列表，支持参数编辑
  - [x] SubTask 4.3: 展示生成的条件列表，支持编辑

- [x] Task 5: 实现保存功能
  - [x] SubTask 5.1: 实现保存 AI 生成策略的逻辑
  - [x] SubTask 5.2: 添加成功/失败提示

- [x] Task 6: 添加国际化支持
  - [x] SubTask 6.1: 在 zh-CN.ts 中添加 AI 策略相关翻译
  - [x] SubTask 6.2: 在 en-US.ts 中添加 AI 策略相关翻译

- [x] Task 7: 验证与测试
  - [x] SubTask 7.1: 测试 AI 生成功能
  - [x] SubTask 7.2: 测试数据编辑功能
  - [x] SubTask 7.3: 测试保存功能

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 3]
- [Task 7] depends on [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6]
