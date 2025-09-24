<template>
  <div class="text-center py-12">
    <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
      <component :is="icon" class="h-full w-full" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-500 dark:text-gray-400 mb-6">
      {{ description }}
    </p>
    <slot name="action">
      <el-button v-if="actionText" type="primary" @click="$emit('action')">
        {{ actionText }}
      </el-button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'

interface Props {
  title: string
  description: string
  icon?: any
  actionText?: string
}

interface Emits {
  (e: 'action'): void
}

withDefaults(defineProps<Props>(), {
  icon: Document
})

defineEmits<Emits>()
</script>