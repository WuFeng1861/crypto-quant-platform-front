<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div>
      <h1 class="page-title">
        {{ $t('nav.settings') }}
      </h1>
      <p class="page-subtitle">
        {{ $t('settings.subtitle') }}
      </p>
    </div>

    <!-- 外观设置 -->
    <div class="theme-card p-6">
      <h3 class="text-lg font-medium theme-text-primary mb-4">
        {{ $t('settings.appearance') }}
      </h3>
      
      <div class="space-y-4">
        <!-- 主题设置 -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('settings.themeMode') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('settings.themeDescription') }}
            </p>
          </div>
          <el-switch
            v-model="isDarkMode"
            @change="handleThemeChange"
            :active-text="$t('settings.dark')"
            :inactive-text="$t('settings.light')"
          />
        </div>

        <!-- 语言设置 -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('settings.language') }}
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('settings.languageDescription') }}
            </p>
          </div>
          <el-select v-model="currentLocale" @change="handleLanguageChange" class="w-32">
            <el-option :label="$t('language.zhCN')" value="zh-CN" />
          <el-option :label="$t('language.enUS')" value="en-US" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- API设置 -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ $t('settings.apiSettings') }}
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('settings.apiBaseUrl') }}
          </label>
          <el-input
            v-model="apiBaseUrl"
            placeholder="https://quant.wufeng98.cn/api"
            @blur="handleApiUrlChange"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ $t('settings.apiDescription') }}
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <el-button @click="testConnection" :loading="testing">
            {{ $t('settings.testConnection') }}
          </el-button>
          <span v-if="connectionStatus" :class="connectionStatusClass">
            {{ connectionStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- 系统信息 -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ $t('settings.systemInfo') }}
      </h3>
      
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('settings.version') }}</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">v1.0.0</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('settings.buildTime') }}</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ buildTime }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('settings.browser') }}</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ userAgent }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('settings.screenResolution') }}</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ screenResolution }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const { locale, t: $t } = useI18n()
const userStore = useUserStore()

const apiBaseUrl = ref('https://quant.wufeng98.cn/api')
// const apiBaseUrl = ref('http://localhost:3099')
const testing = ref(false)
const connectionStatus = ref('')

const isDarkMode = computed({
  get: () => userStore.theme === 'dark',
  set: (value: boolean) => {
    userStore.setTheme(value ? 'dark' : 'light')
  }
})

const currentLocale = computed({
  get: () => userStore.locale,
  set: (value: 'zh-CN' | 'en-US') => {
    userStore.setLocale(value)
    locale.value = value
  }
})

const connectionStatusClass = computed(() => {
  if (connectionStatus.value === $t('settings.connectionSuccess')) {
    return 'text-success-600'
  } else if (connectionStatus.value === $t('settings.connectionFailed')) {
    return 'text-danger-600'
  }
  return 'text-gray-500'
})

const buildTime = computed(() => {
  return new Date().toLocaleString()
})

const userAgent = computed(() => {
  return navigator.userAgent.split(' ').slice(-2).join(' ')
})

const screenResolution = computed(() => {
  return `${screen.width} x ${screen.height}`
})

const handleThemeChange = (value: boolean) => {
  userStore.setTheme(value ? 'dark' : 'light')
  ElMessage.success(value ? $t('settings.themeSwitchedDark') : $t('settings.themeSwitchedLight'))
}

const handleLanguageChange = (value: 'zh-CN' | 'en-US') => {
  userStore.setLocale(value)
  locale.value = value
  ElMessage.success($t('settings.languageUpdated'))
}

const handleApiUrlChange = () => {
  // 这里可以更新API基础URL配置
  ElMessage.info($t('settings.apiUpdated'))
}

const testConnection = async () => {
  testing.value = true
  connectionStatus.value = ''
  
  try {
    // 测试API连接
    await api.get('/health')
    connectionStatus.value = $t('settings.connectionSuccess')
    ElMessage.success($t('settings.connectionSuccess'))
  } catch (error) {
    connectionStatus.value = $t('settings.connectionFailed')
    ElMessage.error($t('settings.connectionFailed'))
  } finally {
    testing.value = false
  }
}
</script>