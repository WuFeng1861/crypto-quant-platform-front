<template>
  <div class="h-full flex">
    <!-- 侧边栏 -->
    <aside 
      class="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
    >
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Logo -->
        <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ $t('nav.dashboard') }}
          </h1>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="flex-1 px-2 py-4 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === item.path || $route.path.startsWith(item.path + '/')
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <component 
              :is="item.icon" 
              class="mr-3 h-5 w-5 flex-shrink-0"
              :class="[
                $route.path === item.path || $route.path.startsWith(item.path + '/')
                  ? 'text-primary-500'
                  : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
              ]"
            />
            {{ $t(item.title) }}
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航栏 -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-4">
          <!-- 移动端菜单按钮 -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu class="h-6 w-6" />
          </button>

          <!-- 页面标题 -->
          <div class="flex-1 md:flex-none">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ currentPageTitle }}
            </h2>
          </div>

          <!-- 右侧工具栏 -->
          <div class="flex items-center space-x-4">
            <!-- 语言切换 -->
            <el-dropdown @command="handleLanguageChange">
              <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Switch class="h-5 w-5" />
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
                  <el-dropdown-item command="en-US">English</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 主题切换 -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Moon v-if="userStore.theme === 'light'" class="h-5 w-5" />
              <Sunny v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </div>

    <!-- 移动端侧边栏 -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-50 md:hidden"
      @click="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      <div class="fixed inset-y-0 left-0 flex w-64 bg-white dark:bg-gray-800">
        <div class="flex-1 flex flex-col min-h-0">
          <!-- Logo -->
          <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              量化平台
            </h1>
          </div>
          
          <!-- 导航菜单 -->
          <nav class="flex-1 px-2 py-4 space-y-1">
            <router-link
              v-for="item in menuItems"
              :key="item.name"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              :class="[
                $route.path === item.path || $route.path.startsWith(item.path + '/')
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <component 
                :is="item.icon" 
                class="mr-3 h-5 w-5 flex-shrink-0"
                :class="[
                  $route.path === item.path || $route.path.startsWith(item.path + '/')
                    ? 'text-primary-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                ]"
              />
              {{ $t(item.title) }}
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import {
  Menu,
  Switch,
  Moon,
  Sunny,
  DataAnalysis,
  TrendCharts,
  Timer,
  Money,
  Clock,
  Setting,
  Monitor
} from '@element-plus/icons-vue'

const route = useRoute()
const { t, locale } = useI18n()
const userStore = useUserStore()

const mobileMenuOpen = ref(false)

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    title: 'nav.dashboard',
    icon: Monitor
  },
  {
    name: 'Indicators',
    path: '/indicators',
    title: 'nav.indicators',
    icon: DataAnalysis
  },
  {
    name: 'Strategies',
    path: '/strategies',
    title: 'nav.strategies',
    icon: TrendCharts
  },
  {
    name: 'Backtest',
    path: '/backtest',
    title: 'nav.backtest',
    icon: Timer
  },
  {
    name: 'TradingPairs',
    path: '/trading-pairs',
    title: 'nav.tradingPairs',
    icon: Money
  },
  {
    name: 'Timeframes',
    path: '/timeframes',
    title: 'nav.timeframes',
    icon: Clock
  },
  {
    name: 'Settings',
    path: '/settings',
    title: 'nav.settings',
    icon: Setting
  }
]

const currentPageTitle = computed(() => {
  const meta = route.meta
  if (meta?.title) {
    return t(meta.title as string)
  }
  return t('nav.dashboard')
})

const toggleTheme = () => {
  const newTheme = userStore.theme === 'light' ? 'dark' : 'light'
  userStore.setTheme(newTheme)
}

const handleLanguageChange = (lang: string) => {
  locale.value = lang
  userStore.setLocale(lang as 'zh-CN' | 'en-US')
}
</script>