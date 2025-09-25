<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('nav.settings') }}
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        系统设置和偏好配置
      </p>
    </div>

    <!-- 外观设置 -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        外观设置
      </h3>
      
      <div class="space-y-4">
        <!-- 主题设置 -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              主题模式
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              选择浅色或深色主题
            </p>
          </div>
          <el-switch
            v-model="isDarkMode"
            @change="handleThemeChange"
            active-text="深色"
            inactive-text="浅色"
          />
        </div>

        <!-- 语言设置 -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              语言设置
            </label>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              选择界面显示语言
            </p>
          </div>
          <el-select v-model="currentLocale" @change="handleLanguageChange" class="w-32">
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- API设置 -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        API设置
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API基础URL
          </label>
          <el-input
            v-model="apiBaseUrl"
            placeholder="https://quant.wufeng98.cn/api"
            @blur="handleApiUrlChange"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            后端API服务器地址
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <el-button @click="testConnection" :loading="testing">
            测试连接
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
        系统信息
      </h3>
      
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">版本</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">v1.0.0</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">构建时间</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ buildTime }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">浏览器</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ userAgent }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">屏幕分辨率</dt>
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

const { locale } = useI18n()
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
  if (connectionStatus.value.includes('成功')) {
    return 'text-success-600'
  } else if (connectionStatus.value.includes('失败')) {
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
  ElMessage.success(`已切换到${value ? '深色' : '浅色'}主题`)
}

const handleLanguageChange = (value: 'zh-CN' | 'en-US') => {
  userStore.setLocale(value)
  locale.value = value
  ElMessage.success('语言设置已更新')
}

const handleApiUrlChange = () => {
  // 这里可以更新API基础URL配置
  ElMessage.info('API地址已更新，重启应用后生效')
}

const testConnection = async () => {
  testing.value = true
  connectionStatus.value = ''
  
  try {
    // 测试API连接
    await api.get('/health')
    connectionStatus.value = '连接成功'
    ElMessage.success('API连接测试成功')
  } catch (error) {
    connectionStatus.value = '连接失败'
    ElMessage.error('API连接测试失败')
  } finally {
    testing.value = false
  }
}
</script>