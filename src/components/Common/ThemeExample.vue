<template>
  <div class="space-y-6">
    <!-- 页面标题示例 -->
    <div>
      <h1 class="page-title">页面标题示例</h1>
      <p class="page-subtitle">这是页面副标题的示例</p>
    </div>

    <!-- 卡片示例 -->
    <div class="theme-card p-6">
      <h3 class="text-lg font-medium theme-text-primary mb-4">主题卡片示例</h3>
      <p class="theme-text-secondary">这是一个使用主题样式的卡片内容。</p>
    </div>

    <!-- 表格示例 -->
    <div class="theme-card p-6">
      <h3 class="text-lg font-medium theme-text-primary mb-4">主题表格示例</h3>
      <div class="overflow-x-auto">
        <table class="theme-table">
          <thead class="theme-table-header">
            <tr>
              <th class="theme-table-header-cell">名称</th>
              <th class="theme-table-header-cell">状态</th>
              <th class="theme-table-header-cell">收益率</th>
            </tr>
          </thead>
          <tbody class="theme-table-body">
            <tr>
              <td class="theme-table-cell">策略 A</td>
              <td class="theme-table-cell">
                <span class="status-success px-2 py-1 rounded-full text-xs font-semibold">运行中</span>
              </td>
              <td class="theme-table-cell return-positive">+15.2%</td>
            </tr>
            <tr>
              <td class="theme-table-cell">策略 B</td>
              <td class="theme-table-cell">
                <span class="status-warning px-2 py-1 rounded-full text-xs font-semibold">暂停</span>
              </td>
              <td class="theme-table-cell return-negative">-3.8%</td>
            </tr>
            <tr>
              <td class="theme-table-cell">策略 C</td>
              <td class="theme-table-cell">
                <span class="status-danger px-2 py-1 rounded-full text-xs font-semibold">错误</span>
              </td>
              <td class="theme-table-cell return-neutral">0.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 信息框示例 -->
    <div class="space-y-4">
      <div class="info-box info-box-blue">
        <h4 class="info-box-title info-box-title-blue">蓝色信息框</h4>
        <p class="info-box-text info-box-text-blue">这是一个蓝色主题的信息提示框。</p>
      </div>

      <div class="info-box info-box-yellow">
        <h4 class="info-box-title info-box-title-yellow">黄色警告框</h4>
        <p class="info-box-text info-box-text-yellow">这是一个黄色主题的警告提示框。</p>
      </div>
    </div>

    <!-- 按钮示例 -->
    <div class="theme-card p-6">
      <h3 class="text-lg font-medium theme-text-primary mb-4">按钮样式示例</h3>
      <div class="flex space-x-4">
        <button class="btn-primary px-4 py-2 rounded-lg">主要按钮</button>
        <button class="btn-secondary px-4 py-2 rounded-lg">次要按钮</button>
        <button class="btn-danger px-4 py-2 rounded-lg">危险按钮</button>
      </div>
    </div>

    <!-- 表单示例 -->
    <div class="theme-card p-6">
      <h3 class="text-lg font-medium theme-text-primary mb-4">表单样式示例</h3>
      <div class="space-y-4">
        <div>
          <label class="theme-label block mb-2">输入框标签</label>
          <input type="text" class="input-theme w-full" placeholder="请输入内容">
        </div>
        <div>
          <label class="theme-label block mb-2">选择器标签</label>
          <select class="select-theme w-full">
            <option>选项 1</option>
            <option>选项 2</option>
            <option>选项 3</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这个组件展示了如何使用新的主题类
</script>