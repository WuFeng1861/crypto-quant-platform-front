import api from './index'

export interface AIGenerateIndicatorRequest {
  userInput: string
}

export interface AIGenerateIndicatorResponse {
  success: boolean
  generatedCode: {
    code: string
    parameters: Array<{
      name: string
      paramType: string
      defaultValue: string
      description: string
    }>
  }
}

export interface AICreateIndicatorRequest {
  userInput: string
  name?: string
}

export interface AICreateIndicatorResponse {
  success: boolean
  indicator: {
    id: number
    name: string
    description?: string
    calculationCode: string
    parameters: Array<{
      id: number
      name: string
      description: string
      paramType: string
      defaultValue: string
    }>
    createdAt: string
    updatedAt: string
  }
  generatedCode: string
}

export const aiIndicatorApi = {
  generate: (data: AIGenerateIndicatorRequest) => {
    return api.post<AIGenerateIndicatorResponse>('/ai-indicator-generator/generate', data)
  },

  create: (data: AICreateIndicatorRequest) => {
    return api.post<AICreateIndicatorResponse>('/ai-indicator-generator/create', data)
  }
}