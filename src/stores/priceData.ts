import { defineStore } from 'pinia'
import { priceDataApi } from '@/api/priceData'
import type { TradingPair, Timeframe } from '@/types'

export const usePriceDataStore = defineStore('priceData', {
  state: () => ({
    tradingPairs: [] as TradingPair[],
    timeframes: [] as Timeframe[],
    loading: false
  }),

  getters: {
    getTradingPairById: (state) => (id: number) => {
      return state.tradingPairs.find(pair => pair.id === id)
    },

    getTimeframeById: (state) => (id: number) => {
      return state.timeframes.find(timeframe => timeframe.id === id)
    }
  },

  actions: {
    async fetchTradingPairs(force = false) {
      // 如果已有数据且不强制刷新，直接返回
      if (this.tradingPairs.length > 0 && !force) {
        return this.tradingPairs
      }
      
      this.loading = true
      try {
        this.tradingPairs = await priceDataApi.tradingPairs.getAll()
        return this.tradingPairs
      } catch (error) {
        console.error('获取交易对列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTimeframes(force = false) {
      // 如果已有数据且不强制刷新，直接返回
      if (this.timeframes.length > 0 && !force) {
        return this.timeframes
      }
      
      this.loading = true
      try {
        this.timeframes = await priceDataApi.timeframes.getAll()
        return this.timeframes
      } catch (error) {
        console.error('获取时间框架列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTradingPair(data: Omit<TradingPair, 'id' | 'createdAt'>) {
      try {
        const newPair = await priceDataApi.tradingPairs.create(data)
        this.tradingPairs.push(newPair)
        return newPair
      } catch (error) {
        console.error('创建交易对失败:', error)
        throw error
      }
    },

    async createTimeframe(data: Omit<Timeframe, 'id' | 'createdAt'>) {
      try {
        const newTimeframe = await priceDataApi.timeframes.create(data)
        this.timeframes.push(newTimeframe)
        return newTimeframe
      } catch (error) {
        console.error('创建时间框架失败:', error)
        throw error
      }
    },

    async deleteTradingPair(id: number) {
      try {
        await priceDataApi.tradingPairs.delete(id)
        this.tradingPairs = this.tradingPairs.filter(pair => pair.id !== id)
      } catch (error) {
        console.error('删除交易对失败:', error)
        throw error
      }
    },

    async deleteTimeframe(id: number) {
      try {
        await priceDataApi.timeframes.delete(id)
        this.timeframes = this.timeframes.filter(timeframe => timeframe.id !== id)
      } catch (error) {
        console.error('删除时间框架失败:', error)
        throw error
      }
    }
  }
})