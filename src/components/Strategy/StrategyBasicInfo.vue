<template>
  <div class="mb-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ $t('strategies.basicInfo') }}</h3>
    
    <el-form-item :label="$t('strategies.name')" prop="name">
      <el-input
        v-model="form.name"
        :placeholder="$t('strategies.name')"
        maxlength="100"
        show-word-limit
      />
    </el-form-item>

    <el-form-item :label="$t('strategies.description')" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :placeholder="$t('strategies.description')"
        :rows="3"
        maxlength="500"
        show-word-limit
      />
    </el-form-item>

    <el-form-item :label="$t('strategies.positionType')" prop="positionType">
      <el-select v-model="form.positionType" :placeholder="$t('strategies.selectPositionType')">
        <el-option :label="$t('strategies.positionTypes.long')" value="long" />
        <el-option :label="$t('strategies.positionTypes.short')" value="short" />
        <el-option :label="$t('strategies.positionTypes.both')" value="both" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import type { CreateStrategyRequest, UpdateStrategyRequest } from '@/types'

interface Props {
  form: CreateStrategyRequest | UpdateStrategyRequest
}

defineProps<Props>()
</script>