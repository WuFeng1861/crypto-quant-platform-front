import { defineStore } from 'pinia'
import { backtestApi } from '@/api/backtest'
import type { BacktestResult, BacktestRequest, Trade } from '@/types'

export const useBacktestStore = defineStore('backtest', {
  state: () => ({
    backtests: [] as BacktestResult[],
    currentBacktest: null as BacktestResult | null,
    currentTrades: [] as Trade[],
    loading: false,
    runningBacktests: new Set<number>()
  }),

  getters: {
    getBacktestById: (state) => (id: number) => {
      return state.backtests.find(backtest => backtest.id === id)
    },

    runningBacktestsList: (state) => {
      return state.backtests.filter(backtest => 
        state.runningBacktests.has(backtest.id) || backtest.status === 'running'
      )
    }
  },

  actions: {
    async fetchBacktests() {
      this.loading = true
      try {
        this.backtests = await backtestApi.getAll()
      } catch (error) {
        console.error('获取回测列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchBacktestById(id: number) {
      this.loading = true
      try {
        this.currentBacktest = await backtestApi.getById(id)
        
        // 更新列表中的对应项
        const index = this.backtests.findIndex(backtest => backtest.id === id)
        if (index !== -1) {
          this.backtests[index] = this.currentBacktest
        }
      } catch (error) {
        console.error('获取回测详情失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTrades(id: number) {
      try {
        this.currentTrades = await backtestApi.getTrades(id)
      } catch (error) {
        console.error('获取交易记录失败:', error)
      }
    },

    async createBacktest(data: BacktestRequest) {
      try {
        const result = await backtestApi.create(data)
        
        if (result.success && result.backtestId) {
          // 添加到运行中的回测列表
          this.runningBacktests.add(result.backtestId)
          
          // 重新获取回测列表
          await this.fetchBacktests()
          
          // 开始监控回测状态
          this.monitorBacktest(result.backtestId)
        }
        
        return result
      } catch (error) {
        console.error('创建回测失败:', error)
        throw error
      }
    },

    async deleteBacktest(id: number) {
      try {
        await backtestApi.delete(id)
        this.backtests = this.backtests.filter(backtest => backtest.id !== id)
        this.runningBacktests.delete(id)
      } catch (error) {
        console.error('删除回测失败:', error)
        throw error
      }
    },

    // 监控回测状态
    monitorBacktest(id: number) {
      const checkStatus = async () => {
        try {
          const backtest = await backtestApi.getById(id)
          
          // 更新列表中的状态
          const index = this.backtests.findIndex(b => b.id === id)
          if (index !== -1) {
            this.backtests[index] = backtest
          }
          
          if (backtest.status === 'running') {
            // 30秒后再次检查
            setTimeout(checkStatus, 30000)
          } else {
            // 回测完成，从运行中列表移除
            this.runningBacktests.delete(id)
          }
        } catch (error) {
          console.error('检查回测状态失败:', error)
          this.runningBacktests.delete(id)
        }
      }
      
      // 立即检查一次，然后每30秒检查一次
      checkStatus()
    }
  }
})