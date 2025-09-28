/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // 成功状态
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // 危险/错误状态
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 警告状态
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 主题语义化颜色
        surface: {
          DEFAULT: 'rgb(255 255 255 / <alpha-value>)',
          dark: 'rgb(17 24 39 / <alpha-value>)',
        },
        'surface-variant': {
          DEFAULT: 'rgb(249 250 251 / <alpha-value>)',
          dark: 'rgb(31 41 55 / <alpha-value>)',
        },
        'on-surface': {
          DEFAULT: 'rgb(17 24 39 / <alpha-value>)',
          dark: 'rgb(255 255 255 / <alpha-value>)',
        },
        'on-surface-variant': {
          DEFAULT: 'rgb(107 114 128 / <alpha-value>)',
          dark: 'rgb(156 163 175 / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(229 231 235 / <alpha-value>)',
          dark: 'rgb(55 65 81 / <alpha-value>)',
        },
        'border-variant': {
          DEFAULT: 'rgb(209 213 219 / <alpha-value>)',
          dark: 'rgb(75 85 99 / <alpha-value>)',
        }
      },
      // 主题相关的背景色
      backgroundColor: {
        'theme-surface': 'var(--color-surface)',
        'theme-surface-variant': 'var(--color-surface-variant)',
        'theme-primary': 'var(--color-primary)',
      },
      // 主题相关的文字颜色
      textColor: {
        'theme-on-surface': 'var(--color-on-surface)',
        'theme-on-surface-variant': 'var(--color-on-surface-variant)',
        'theme-primary': 'var(--color-primary)',
      },
      // 主题相关的边框颜色
      borderColor: {
        'theme-border': 'var(--color-border)',
        'theme-border-variant': 'var(--color-border-variant)',
      }
    },
  },
  plugins: [
    // 添加主题组件插件
    function({ addComponents, theme }) {
      addComponents({
        // 页面标题样式
        '.page-title': {
          '@apply text-2xl font-bold text-gray-900 dark:text-white': {},
        },
        '.page-subtitle': {
          '@apply mt-1 text-sm text-gray-500 dark:text-gray-400': {},
        },
        
        // 卡片样式
        '.theme-card': {
          '@apply bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm': {},
        },
        
        // 表格样式
        '.theme-table': {
          '@apply min-w-full divide-y divide-gray-200 dark:divide-gray-700': {},
        },
        '.theme-table-header': {
          '@apply bg-gray-50 dark:bg-gray-800': {},
        },
        '.theme-table-header-cell': {
          '@apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider': {},
        },
        '.theme-table-body': {
          '@apply bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700': {},
        },
        '.theme-table-cell': {
          '@apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white': {},
        },
        '.theme-table-cell-secondary': {
          '@apply px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400': {},
        },
        
        // 文本样式
        '.theme-text-primary': {
          '@apply text-gray-900 dark:text-white': {},
        },
        '.theme-text-secondary': {
          '@apply text-gray-500 dark:text-gray-400': {},
        },
        '.theme-text-muted': {
          '@apply text-gray-400 dark:text-gray-500': {},
        },
        
        // 状态样式
        '.status-success': {
          '@apply bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200': {},
        },
        '.status-warning': {
          '@apply bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200': {},
        },
        '.status-danger': {
          '@apply bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200': {},
        },
        
        // 收益率颜色
        '.return-positive': {
          '@apply text-success-600 dark:text-success-400': {},
        },
        '.return-negative': {
          '@apply text-danger-600 dark:text-danger-400': {},
        },
        '.return-neutral': {
          '@apply text-gray-900 dark:text-white': {},
        },
        
        // 表单样式
        '.theme-input': {
          '@apply bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white': {},
        },
        '.theme-label': {
          '@apply text-sm font-medium text-gray-700 dark:text-gray-300': {},
        },
        
        // 信息提示框
        '.info-box': {
          '@apply p-4 rounded-lg': {},
        },
        '.info-box-blue': {
          '@apply bg-blue-50 dark:bg-blue-900/20': {},
        },
        '.info-box-yellow': {
          '@apply bg-yellow-50 dark:bg-yellow-900/20': {},
        },
        '.info-box-title': {
          '@apply text-sm font-medium mb-2': {},
        },
        '.info-box-title-blue': {
          '@apply text-blue-900 dark:text-blue-100': {},
        },
        '.info-box-title-yellow': {
          '@apply text-yellow-900 dark:text-yellow-100': {},
        },
        '.info-box-text': {
          '@apply text-sm': {},
        },
        '.info-box-text-blue': {
          '@apply text-blue-700 dark:text-blue-300': {},
        },
        '.info-box-text-yellow': {
          '@apply text-yellow-700 dark:text-yellow-300': {},
        }
      })
    }
  ],
}