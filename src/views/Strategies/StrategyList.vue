<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">
          {{ $t('strategies.title') }}
        </h1>
        <p class="page-subtitle">
          管理和配置您的交易策略
        </p>
      </div>
    </div>

    <!-- 策略管理组件 -->
    <div class="card">
      <div class="p-6">
        <StrategyManager />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StrategyManager from '@/components/Common/StrategyManager.vue'
</script>