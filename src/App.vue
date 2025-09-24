<template>
  <div id="app" class="h-full">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 初始化主题
  userStore.initTheme()
})
</script>