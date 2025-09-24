import api from './index'
import type { Strategy, StrategyWithDetails } from '@/types'

export const strategyApi = {
  // 获取所有策略
  getAll(): Promise<Strategy[]> {
    return api.get('/strategies')
  },

  // 获取所有策略详情
  getAllWithDetails(): Promise<StrategyWithDetails[]> {
    return api.get('/strategies/with-details/all')
  },

  // 根据ID获取策略
  getById(id: number): Promise<Strategy> {
    return api.get(`/strategies/${id}`)
  },

  // 创建策略
  create(data: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Strategy> {
    return api.post('/strategies', data)
  },

  // 更新策略
  update(id: number, data: Partial<Strategy>): Promise<Strategy> {
    return api.put(`/strategies/${id}`, data)
  },

  // 删除策略
  delete(id: number): Promise<void> {
    return api.delete(`/strategies/${id}`)
  }
}