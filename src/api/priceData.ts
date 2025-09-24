import api from './index'
import type { TradingPair, Timeframe } from '@/types'

export const priceDataApi = {
  // 交易对相关
  tradingPairs: {
    getAll(): Promise<TradingPair[]> {
      return api.get('/price-data/trading-pairs-all')
    },

    create(data: Omit<TradingPair, 'id' | 'createdAt'>): Promise<TradingPair> {
      return api.post('/price-data/trading-pairs', data)
    },

    delete(id: number): Promise<void> {
      return api.delete(`/price-data/trading-pairs/${id}`)
    }
  },

  // 时间框架相关
  timeframes: {
    getAll(): Promise<Timeframe[]> {
      return api.get('/price-data/timeframes-all')
    },

    create(data: Omit<Timeframe, 'id' | 'createdAt'>): Promise<Timeframe> {
      return api.post('/price-data/timeframes', data)
    },

    delete(id: number): Promise<void> {
      return api.delete(`/price-data/timeframes/${id}`)
    }
  }
}