import api from './index'
import type { 
  Indicator, 
  IndicatorCalculateRequest, 
  IndicatorCalculateWithDataRequest 
} from '@/types'

export const indicatorApi = {
  // 获取所有指标
  getAll(): Promise<Indicator[]> {
    return api.get('/indicators')
  },

  // 根据ID获取指标
  getById(id: number): Promise<Indicator> {
    return api.get(`/indicators/${id}`)
  },

  // 创建指标
  create(data: Omit<Indicator, 'id' | 'createdAt' | 'updatedAt'>): Promise<Indicator> {
    return api.post('/indicators', data)
  },

  // 更新指标
  update(id: number, data: Partial<Indicator>): Promise<Indicator> {
    return api.put(`/indicators/${id}`, data)
  },

  // 删除指标
  delete(id: number): Promise<void> {
    return api.delete(`/indicators/${id}`)
  },

  // 使用用户数据计算指标
  calculate(id: number, data: IndicatorCalculateRequest): Promise<any> {
    return api.post(`/indicators/${id}/calculate`, data)
  },

  // 使用系统数据计算指标
  calculateWithData(id: number, data: IndicatorCalculateWithDataRequest): Promise<any> {
    return api.post(`/indicators/${id}/calculate-with-data`, data)
  }
}