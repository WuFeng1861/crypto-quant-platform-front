# 加密货币量化回测平台 - 前端

这是一个基于 Vue 3 + TypeScript + Tailwind CSS 的加密货币量化回测平台前端应用。

## 功能特性

- 🎯 **指标管理** - 创建和管理技术指标，支持自定义计算代码
- 📊 **策略构建** - 可视化策略构建器，支持多指标组合和条件设置
- 🔄 **回测执行** - 异步回测执行，实时状态监控
- 📈 **结果分析** - 详细的回测结果展示和交易记录分析
- 🌓 **主题切换** - 支持明暗主题切换
- 🌍 **国际化** - 支持中英文切换
- 📱 **响应式设计** - 完美适配桌面和移动端

## 技术栈

- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **代码高亮**: highlight.js
- **国际化**: Vue I18n

## 项目结构

```
src/
├── api/                    # API接口封装
│   ├── index.ts           # Axios配置和拦截器
│   ├── indicators.ts      # 指标相关API
│   ├── strategies.ts      # 策略相关API
│   ├── backtest.ts        # 回测相关API
│   └── priceData.ts       # 价格数据API
├── components/            # 通用组件
│   ├── Common/           # 公共组件
│   └── Layout/           # 布局组件
├── locales/              # 国际化文件
│   ├── zh-CN.ts         # 中文语言包
│   └── en-US.ts         # 英文语言包
├── router/               # 路由配置
├── stores/               # Pinia状态管理
│   ├── user.ts          # 用户设置
│   ├── indicators.ts    # 指标状态
│   ├── strategies.ts    # 策略状态
│   ├── backtest.ts      # 回测状态
│   └── priceData.ts     # 基础数据状态
├── types/                # TypeScript类型定义
├── utils/                # 工具函数
│   ├── format.ts        # 格式化函数
│   └── validation.ts    # 验证规则
├── views/                # 页面组件
│   ├── Dashboard/       # 仪表板
│   ├── Indicators/      # 指标管理
│   ├── Strategies/      # 策略管理
│   ├── Backtest/        # 回测管理
│   ├── TradingPairs/    # 交易对管理
│   ├── Timeframes/      # 时间框架管理
│   └── Settings/        # 系统设置
├── App.vue              # 根组件
├── main.ts              # 应用入口
└── style.css            # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

复制环境变量文件并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置后端API地址：

```env
VITE_API_BASE_URL=http://localhost:3099
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 生产构建

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

## 页面路由

- `/` - 仪表板
- `/indicators` - 指标列表
- `/indicators/create` - 创建指标
- `/indicators/:id` - 指标详情
- `/strategies` - 策略列表
- `/strategies/create` - 创建策略
- `/strategies/:id` - 策略详情
- `/backtest` - 回测列表
- `/backtest/create` - 创建回测
- `/backtest/:id` - 回测详情
- `/trading-pairs` - 交易对管理
- `/timeframes` - 时间框架管理
- `/settings` - 系统设置

## API接口

### 后端API格式

所有API响应遵循统一格式：

```typescript
interface ApiResponse<T> {
  code: number        // HTTP状态码
  message: string     // 响应消息
  data: T            // 实际数据
  timestamp: number   // 时间戳
}
```

### 主要接口

- `GET /indicators` - 获取指标列表
- `POST /indicators` - 创建指标
- `POST /indicators/:id/calculate` - 计算指标
- `GET /strategies/with-details/all` - 获取策略列表
- `POST /strategies` - 创建策略
- `GET /backtest` - 获取回测列表
- `POST /backtest` - 创建回测
- `GET /backtest/:id` - 获取回测详情
- `GET /price-data/trading-pairs` - 获取交易对
- `GET /price-data/timeframes` - 获取时间框架

## 核心功能

### 指标管理

- 创建自定义技术指标
- 支持JavaScript代码编写计算逻辑
- 参数化配置
- 指标计算和测试

### 策略构建

- 可视化策略构建器
- 多指标组合
- 灵活的交易条件设置
- 风险管理参数配置

### 回测系统

- 异步回测执行
- 实时状态监控
- 详细的性能指标
- 交易记录分析

### 数据管理

- 交易对配置
- 时间框架设置
- 价格数据管理

## 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在国际化文件中添加相关文本
4. 如需要，在侧边栏菜单中添加导航

### 添加新API

1. 在 `src/api/` 下创建或扩展API文件
2. 在 `src/types/index.ts` 中定义相关类型
3. 在对应的store中添加状态管理逻辑

### 样式开发

- 使用 Tailwind CSS 工具类
- 遵循响应式设计原则
- 支持明暗主题切换
- 使用 Element Plus 组件

## 部署

### Docker部署

```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 环境变量

生产环境需要配置以下环境变量：

- `VITE_API_BASE_URL` - 后端API地址
- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。