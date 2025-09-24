import api from './index'
import type { 
  BacktestRequest, 
  BacktestCreateResponse, 
  BacktestResult, 
  Trade 
} from '@/types'

export const backtestApi = {
  // 获取所有回测记录
  getAll(): Promise<BacktestResult[]> {
    return api.get('/backtest')
  },

  // 根据ID获取回测详情
  getById(id: number): Promise<BacktestResult> {
    return api.get(`/backtest/${id}`)
  },

  // 创建回测
  create(data: BacktestRequest): Promise<BacktestCreateResponse> {
    return api.post('/backtest', data)
  },

  // 获取回测交易记录
  getTrades(id: number): Promise<Trade[]> {
    return api.get(`/backtest/${id}/trades`)
  },

  // 删除回测
  delete(id: number): Promise<void> {
    return api.delete(`/backtest/${id}`)
  }
}