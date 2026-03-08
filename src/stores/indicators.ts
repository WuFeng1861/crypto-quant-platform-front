import { defineStore } from 'pinia'
import { indicatorApi } from '@/api/indicators'
import type { Indicator } from '@/types'

export const useIndicatorStore = defineStore('indicators', {
  state: () => ({
    indicators: [] as Indicator[],
    currentIndicator: null as Indicator | null,
    loading: false
  }),

  getters: {
    getIndicatorById: (state) => (id: number) => {
      return state.indicators.find(indicator => indicator.id === id)
    }
  },

  actions: {
    async fetchIndicators(force = false) {
      // 如果已有数据且不强制刷新，直接返回
      if (this.indicators.length > 0 && !force) {
        return this.indicators
      }
      
      this.loading = true
      try {
        this.indicators = await indicatorApi.getAll()
        return this.indicators
      } catch (error) {
        console.error('获取指标列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchIndicatorById(id: number) {
      this.loading = true
      try {
        this.currentIndicator = await indicatorApi.getById(id)
      } catch (error) {
        console.error('获取指标详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    async createIndicator(data: Omit<Indicator, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      try {
        const indicator = await indicatorApi.create(data)
        this.indicators.push(indicator)
        return indicator
      } catch (error) {
        console.error('创建指标失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateIndicator(id: number, data: Partial<Indicator>) {
      this.loading = true
      try {
        const indicator = await indicatorApi.update(id, data)
        const index = this.indicators.findIndex(i => i.id === id)
        if (index !== -1) {
          this.indicators[index] = indicator
        }
        return indicator
      } catch (error) {
        console.error('更新指标失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async copyIndicator(id: number, newName: string) {
      this.loading = true
      try {
        const original = await indicatorApi.getById(id)
        const { id: _, createdAt: __, updatedAt: ___, ...copyData } = original
        copyData.name = newName
        
        // 如果是复制指标，参数也需要复制（不带ID）
        if (copyData.parameters) {
          copyData.parameters = copyData.parameters.map(p => {
            const { id: ____, indicatorId: _____, createdAt: ______, updatedAt: _______, ...paramData } = p as any
            return paramData
          })
        }

        const indicator = await indicatorApi.create(copyData)
        this.indicators.push(indicator)
        return indicator
      } catch (error) {
        console.error('复制指标失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteIndicator(id: number) {
      try {
        await indicatorApi.delete(id)
        this.indicators = this.indicators.filter(indicator => indicator.id !== id)
      } catch (error) {
        console.error('删除指标失败:', error)
        throw error
      }
    }
  }
})