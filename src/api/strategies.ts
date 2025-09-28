import api from './index'
import type { 
  Strategy, 
  StrategyWithDetails, 
  CreateStrategyRequest, 
  UpdateStrategyRequest,
  UpdateIndicatorRequest,
  UpdateConditionRequest
} from '@/types'

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

  // 获取策略详细信息（包含指标和条件）
  getWithDetails(id: number): Promise<StrategyWithDetails> {
    return api.get(`/strategies/with-details/${id}`)
  },

  // 创建策略
  create(data: CreateStrategyRequest): Promise<Strategy> {
    return api.post('/strategies', data)
  },

  // 更新策略
  update(id: number, data: UpdateStrategyRequest): Promise<Strategy> {
    return api.put(`/strategies/${id}`, data)
  },

  // 删除策略
  delete(id: number): Promise<void> {
    return api.delete(`/strategies/${id}`)
  },

  // 获取策略指标
  getIndicators(strategyId: number) {
    return api.get(`/strategies/${strategyId}/indicators`)
  },

  // 更新策略指标
  updateIndicator(strategyId: number, indicatorId: number, data: UpdateIndicatorRequest) {
    return api.put(`/strategies/${strategyId}/indicators/${indicatorId}`, data)
  },

  // 删除策略指标
  deleteIndicator(strategyId: number, indicatorId: number): Promise<void> {
    return api.delete(`/strategies/${strategyId}/indicators/${indicatorId}`)
  },

  // 更新策略条件
  updateCondition(strategyId: number, conditionId: number, data: UpdateConditionRequest) {
    return api.put(`/strategies/${strategyId}/conditions/${conditionId}`, data)
  },

  // 删除策略条件
  deleteCondition(strategyId: number, conditionId: number): Promise<void> {
    return api.delete(`/strategies/${strategyId}/conditions/${conditionId}`)
  }
}