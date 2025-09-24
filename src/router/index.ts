import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/Layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: 'nav.dashboard' }
      },
      {
        path: '/indicators',
        name: 'Indicators',
        component: () => import('@/views/Indicators/index.vue'),
        meta: { title: 'nav.indicators' }
      },
      {
        path: '/indicators/create',
        name: 'CreateIndicator',
        component: () => import('@/views/Indicators/Create.vue'),
        meta: { title: 'indicators.create' }
      },
      {
        path: '/indicators/:id',
        name: 'IndicatorDetail',
        component: () => import('@/views/Indicators/Detail.vue'),
        meta: { title: 'indicators.detail' }
      },
      {
        path: '/strategies',
        name: 'Strategies',
        component: () => import('@/views/Strategies/index.vue'),
        meta: { title: 'nav.strategies' }
      },
      {
        path: '/strategies/create',
        name: 'CreateStrategy',
        component: () => import('@/views/Strategies/Create.vue'),
        meta: { title: 'strategies.create' }
      },
      {
        path: '/strategies/:id',
        name: 'StrategyDetail',
        component: () => import('@/views/Strategies/Detail.vue'),
        meta: { title: 'strategies.detail' }
      },
      {
        path: '/backtest',
        name: 'Backtest',
        component: () => import('@/views/Backtest/index.vue'),
        meta: { title: 'nav.backtest' }
      },
      {
        path: '/backtest/create',
        name: 'CreateBacktest',
        component: () => import('@/views/Backtest/Create.vue'),
        meta: { title: 'backtest.create' }
      },
      {
        path: '/backtest/:id',
        name: 'BacktestDetail',
        component: () => import('@/views/Backtest/Detail.vue'),
        meta: { title: 'backtest.detail' }
      },
      {
        path: '/trading-pairs',
        name: 'TradingPairs',
        component: () => import('@/views/TradingPairs/index.vue'),
        meta: { title: 'nav.tradingPairs' }
      },
      {
        path: '/timeframes',
        name: 'Timeframes',
        component: () => import('@/views/Timeframes/index.vue'),
        meta: { title: 'nav.timeframes' }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: { title: 'nav.settings' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router