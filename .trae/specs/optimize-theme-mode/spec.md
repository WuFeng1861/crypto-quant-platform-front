# 黑夜/白天模式优化 Spec

## Why
当前项目主题切换功能存在初始化缺失、样式实现不统一、Element Plus 暗色适配不完整等问题，导致模式切换无效或视觉效果差，影响用户体验。

## What Changes
- 修复主题初始化逻辑，确保页面刷新后主题状态正确应用
- 统一主题样式实现方案，采用 CSS 变量 + Tailwind dark: 前缀混合模式
- 完善 Element Plus 组件的暗色主题适配
- 优化主题切换过渡动画，提升性能
- 添加系统主题偏好检测功能

## Impact
- Affected specs: 主题系统、用户设置、全局样式
- Affected code: 
  - `src/main.ts` - 添加主题初始化
  - `src/stores/user.ts` - 优化主题状态管理
  - `src/styles/theme.css` - 重构 CSS 变量系统
  - `src/style.css` - 完善 Element Plus 暗色适配
  - `tailwind.config.js` - 优化主题配置
  - 所有使用 `dark:` 前缀的组件文件

---

## ADDED Requirements

### Requirement: 主题初始化
系统 SHALL 在应用启动时正确初始化主题状态。

#### Scenario: 页面刷新后主题保持
- **WHEN** 用户设置了深色模式并刷新页面
- **THEN** 页面应保持深色模式，`dark` 类应正确添加到 `<html>` 元素

#### Scenario: 首次访问默认主题
- **WHEN** 用户首次访问应用且 localStorage 无主题设置
- **THEN** 系统应检测用户系统主题偏好并应用对应模式

---

### Requirement: CSS 变量系统
系统 SHALL 提供统一的 CSS 变量主题系统。

#### Scenario: CSS 变量正确定义
- **WHEN** 应用加载时
- **THEN** `:root` 和 `.dark` 选择器下应定义完整的主题变量

#### Scenario: CSS 变量正确应用
- **WHEN** 组件使用主题 CSS 变量
- **THEN** 变量值应根据当前主题正确切换

---

### Requirement: Element Plus 暗色适配
系统 SHALL 为所有使用的 Element Plus 组件提供暗色主题样式。

#### Scenario: 输入组件暗色模式
- **WHEN** 切换到深色模式
- **THEN** el-input、el-select、el-textarea 等输入组件应显示暗色背景和边框

#### Scenario: 弹窗组件暗色模式
- **WHEN** 切换到深色模式
- **THEN** el-dialog、el-dropdown、el-popover 等弹窗组件应显示暗色样式

#### Scenario: 表格组件暗色模式
- **WHEN** 切换到深色模式
- **THEN** el-table 应显示暗色表头、行和边框

---

### Requirement: 主题切换过渡
系统 SHALL 提供流畅的主题切换过渡效果。

#### Scenario: 过渡动画
- **WHEN** 用户切换主题
- **THEN** 界面元素应在 200ms 内平滑过渡，无闪烁

#### Scenario: 性能优化
- **WHEN** 主题切换时
- **THEN** 不应出现明显的性能下降或卡顿

---

## MODIFIED Requirements

### Requirement: 主题状态管理
系统 SHALL 提供可靠的主题状态管理。

**修改内容**:
- 添加系统主题偏好检测
- 优化主题初始化逻辑
- 确保主题状态与 DOM 同步

#### Scenario: 系统主题跟随
- **WHEN** 用户未手动设置主题
- **THEN** 应用应跟随系统主题偏好

#### Scenario: 手动设置优先
- **WHEN** 用户手动设置主题
- **THEN** 应优先使用用户设置，忽略系统偏好

---

## REMOVED Requirements

### Requirement: 全局过渡动画
**Reason**: 对所有元素添加过渡动画影响性能
**Migration**: 仅对主题相关属性添加过渡，使用 `color-scheme` 属性优化
