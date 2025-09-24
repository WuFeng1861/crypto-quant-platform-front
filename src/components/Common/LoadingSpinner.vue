<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" :class="spinnerClass"></div>
    <span v-if="text" class="ml-3 text-gray-600 dark:text-gray-400">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const containerClass = computed(() => {
  return props.fullHeight ? 'h-64' : 'py-8'
})

const spinnerClass = computed(() => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  return sizeClasses[props.size]
})
</script>