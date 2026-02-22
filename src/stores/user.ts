import { defineStore } from 'pinia'
import type { UserSettings } from '@/types'

export const useUserStore = defineStore('user', {
  state: (): UserSettings => ({
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || this?.getSystemTheme?.() || 'light',
    locale: (localStorage.getItem('locale') as 'zh-CN' | 'en-US') || 'zh-CN'
  }),

  actions: {
    getSystemTheme(): 'light' | 'dark' {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'light'
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      localStorage.setItem('theme', theme)
      this.applyThemeToDom(theme)
    },

    applyThemeToDom(theme: 'light' | 'dark') {
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
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      
      if (savedTheme) {
        this.theme = savedTheme
      } else {
        this.theme = this.getSystemTheme()
      }
      
      this.applyThemeToDom(this.theme)
    }
  }
})