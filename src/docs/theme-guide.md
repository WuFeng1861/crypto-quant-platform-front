# Tailwind CSS 主题使用指南

## 概述

本项目已经将主题相关的样式封装到 `tailwind.config.js` 中，提供了一套统一的主题类，方便维护和修改。

## 主题架构

### 1. 配置文件结构
- `tailwind.config.js` - 主题配置和组件类定义
- `src/styles/theme.css` - CSS 变量和额外样式
- `src/style.css` - 主样式文件，引入主题样式

### 2. 颜色系统
```javascript
// 主色调
primary: { 50-900 }
// 状态颜色
success: { 50-900 }
danger: { 50-900 }
warning: { 50-900 }
// 语义化颜色
surface, surface-variant, on-surface, on-surface-variant, border, border-variant
```

## 主题类使用指南

### 页面标题
```vue
<h1 class="page-title">页面标题</h1>
<p class="page-subtitle">页面副标题</p>
```

### 卡片容器
```vue
<div class="theme-card p-6">
  <h3 class="text-lg font-medium theme-text-primary mb-4">卡片标题</h3>
  <p class="theme-text-secondary">卡片内容</p>
</div>
```

### 表格样式
```vue
<table class="theme-table">
  <thead class="theme-table-header">
    <tr>
      <th class="theme-table-header-cell">表头</th>
    </tr>
  </thead>
  <tbody class="theme-table-body">
    <tr>
      <td class="theme-table-cell">主要内容</td>
      <td class="theme-table-cell-secondary">次要内容</td>
    </tr>
  </tbody>
</table>
```

### 文本样式
```vue
<p class="theme-text-primary">主要文本</p>
<p class="theme-text-secondary">次要文本</p>
<p class="theme-text-muted">静音文本</p>
```

### 状态标签
```vue
<span class="status-success px-2 py-1 rounded-full text-xs font-semibold">成功</span>
<span class="status-warning px-2 py-1 rounded-full text-xs font-semibold">警告</span>
<span class="status-danger px-2 py-1 rounded-full text-xs font-semibold">错误</span>
```

### 收益率显示
```vue
<span class="return-positive">+15.2%</span>
<span class="return-negative">-3.8%</span>
<span class="return-neutral">0.0%</span>
```

### 信息提示框
```vue
<!-- 蓝色信息框 -->
<div class="info-box info-box-blue">
  <h4 class="info-box-title info-box-title-blue">提示标题</h4>
  <p class="info-box-text info-box-text-blue">提示内容</p>
</div>

<!-- 黄色警告框 -->
<div class="info-box info-box-yellow">
  <h4 class="info-box-title info-box-title-yellow">警告标题</h4>
  <p class="info-box-text info-box-text-yellow">警告内容</p>
</div>
```

### 表单元素
```vue
<label class="theme-label">标签文本</label>
<input class="input-theme" type="text" placeholder="输入内容">
<select class="select-theme">
  <option>选项</option>
</select>
```

### 按钮样式
```vue
<button class="btn-primary">主要按钮</button>
<button class="btn-secondary">次要按钮</button>
<button class="btn-danger">危险按钮</button>
```

## 迁移指南

### 替换常见样式类

#### 页面标题
```diff
- class="text-2xl font-bold text-gray-900 dark:text-white"
+ class="page-title"

- class="mt-1 text-sm text-gray-500 dark:text-gray-400"
+ class="page-subtitle"
```

#### 卡片容器
```diff
- class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
+ class="theme-card"
```

#### 文本颜色
```diff
- class="text-gray-900 dark:text-white"
+ class="theme-text-primary"

- class="text-gray-500 dark:text-gray-400"
+ class="theme-text-secondary"
```

#### 表格样式
```diff
- class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
+ class="theme-table"

- class="bg-gray-50 dark:bg-gray-800"
+ class="theme-table-header"

- class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
+ class="theme-table-header-cell"
```

## 自定义主题

### 修改颜色
在 `tailwind.config.js` 中修改颜色定义：
```javascript
colors: {
  primary: {
    // 修改主色调
    500: '#your-color',
  }
}
```

### 添加新的组件类
在 `tailwind.config.js` 的 plugins 部分添加：
```javascript
'.your-component': {
  '@apply your-styles': {},
}
```

### 修改 CSS 变量
在 `src/styles/theme.css` 中修改：
```css
:root {
  --your-variable: value;
}
```

## 最佳实践

1. **优先使用主题类**：使用封装好的主题类而不是原始的 Tailwind 类
2. **保持一致性**：在整个项目中使用相同的主题类
3. **语义化命名**：使用语义化的类名，如 `theme-text-primary` 而不是具体的颜色值
4. **集中管理**：所有主题相关的修改都在配置文件中进行
5. **测试主题切换**：确保在浅色和深色主题下都能正常显示

## 示例组件

参考 `src/components/Common/ThemeExample.vue` 查看完整的使用示例。