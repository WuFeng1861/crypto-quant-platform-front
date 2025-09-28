import { defineStore } from 'pinia'
import { strategyApi } from '@/api/strategies'
import type { 
  Strategy, 
  StrategyWithDetails, 
  CreateStrategyRequest, 
  UpdateStrategyRequest,
  UpdateIndicatorRequest,
  UpdateConditionRequest
} from '@/types'

export const useStrategyStore = defineStore('strategies', {
  state: () => ({
    strategies: [] as StrategyWithDetails[],
    currentStrategy: null as StrategyWithDetails | null,
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
        const strategy = await strategyApi.getById(id)
        this.currentStrategy = strategy as StrategyWithDetails
        return strategy
      } catch (error) {
        console.error('获取策略详情失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStrategyWithDetails(id: number) {
      this.loading = true
      try {
        const strategy = await strategyApi.getWithDetails(id)
        this.currentStrategy = strategy
        
        // 更新列表中的策略
        const index = this.strategies.findIndex(s => s.id === id)
        if (index !== -1) {
          this.strategies[index] = strategy
        } else {
          this.strategies.push(strategy)
        }
        
        return strategy
      } catch (error) {
        console.error('获取策略详情失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createStrategy(data: CreateStrategyRequest) {
      try {
        const newStrategy = await strategyApi.create(data)
        // 重新获取列表以更新详情
        await this.fetchStrategies(true)
        return newStrategy
      } catch (error) {
        console.error('创建策略失败:', error)
        throw error
      }
    },

    async updateStrategy(id: number, data: UpdateStrategyRequest) {
      try {
        const updatedStrategy = await strategyApi.update(id, data)
        // 重新获取策略详情以确保数据一致性
        await this.fetchStrategyWithDetails(id)
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
        if (this.currentStrategy?.id === id) {
          this.currentStrategy = null
        }
      } catch (error) {
        console.error('删除策略失败:', error)
        throw error
      }
    },

    // 指标管理
    async updateIndicator(strategyId: number, indicatorId: number, data: UpdateIndicatorRequest) {
      try {
        await strategyApi.updateIndicator(strategyId, indicatorId, data)
        // 重新获取策略详情
        await this.fetchStrategyWithDetails(strategyId)
      } catch (error) {
        console.error('更新指标失败:', error)
        throw error
      }
    },

    async deleteIndicator(strategyId: number, indicatorId: number) {
      try {
        await strategyApi.deleteIndicator(strategyId, indicatorId)
        // 重新获取策略详情
        await this.fetchStrategyWithDetails(strategyId)
      } catch (error) {
        console.error('删除指标失败:', error)
        throw error
      }
    },

    // 条件管理
    async updateCondition(strategyId: number, conditionId: number, data: UpdateConditionRequest) {
      try {
        await strategyApi.updateCondition(strategyId, conditionId, data)
        // 重新获取策略详情
        await this.fetchStrategyWithDetails(strategyId)
      } catch (error) {
        console.error('更新条件失败:', error)
        throw error
      }
    },

    async deleteCondition(strategyId: number, conditionId: number) {
      try {
        await strategyApi.deleteCondition(strategyId, conditionId)
        // 重新获取策略详情
        await this.fetchStrategyWithDetails(strategyId)
      } catch (error) {
        console.error('删除条件失败:', error)
        throw error
      }
    }
  }
})