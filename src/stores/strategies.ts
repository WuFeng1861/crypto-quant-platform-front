import { defineStore } from 'pinia'
import { strategyApi } from '@/api/strategies'
import type { Strategy, StrategyWithDetails } from '@/types'

export const useStrategyStore = defineStore('strategies', {
  state: () => ({
    strategies: [] as StrategyWithDetails[],
    currentStrategy: null as Strategy | null,
    loading: false
  }),

  getters: {
    getStrategyById: (state) => (id: number) => {
      return state.strategies.find(strategy => strategy.id === id)
    }
  },

  actions: {
    async fetchStrategies(force = false) {
      // 如果已有数据且不强制刷新，直接返回
      if (this.strategies.length > 0 && !force) {
        return this.strategies
      }
      
      this.loading = true
      try {
        this.strategies = await strategyApi.getAllWithDetails()
        return this.strategies
      } catch (error) {
        console.error('获取策略列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStrategyById(id: number) {
      this.loading = true
      try {
        this.currentStrategy = await strategyApi.getById(id)
      } catch (error) {
        console.error('获取策略详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    async createStrategy(data: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const newStrategy = await strategyApi.create(data)
        // 重新获取列表以更新详情
        await this.fetchStrategies()
        return newStrategy
      } catch (error) {
        console.error('创建策略失败:', error)
        throw error
      }
    },

    async updateStrategy(id: number, data: Partial<Strategy>) {
      try {
        const updatedStrategy = await strategyApi.update(id, data)
        await this.fetchStrategies()
        return updatedStrategy
      } catch (error) {
        console.error('更新策略失败:', error)
        throw error
      }
    },

    async deleteStrategy(id: number) {
      try {
        await strategyApi.delete(id)
        this.strategies = this.strategies.filter(strategy => strategy.id !== id)
      } catch (error) {
        console.error('删除策略失败:', error)
        throw error
      }
    }
  }
})