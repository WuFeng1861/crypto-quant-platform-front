import { defineStore } from 'pinia'
import type { UserSettings } from '@/types'

export const useUserStore = defineStore('user', {
  state: (): UserSettings => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    locale: (localStorage.getItem('locale') as 'zh-CN' | 'en-US') || 'zh-CN'
  }),

  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      localStorage.setItem('theme', theme)
      
      // 更新 HTML 类名
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setLocale(locale: 'zh-CN' | 'en-US') {
      this.locale = locale
      localStorage.setItem('locale', locale)
    },

    initTheme() {
      // 初始化主题
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
})