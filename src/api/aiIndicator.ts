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
      type: string
      defaultValue: any
      description: string
    }>
  }
}

export const aiIndicatorApi = {
  generate: (data: AIGenerateIndicatorRequest) => {
    return api.post<AIGenerateIndicatorResponse>('/ai-indicator-generator/generate', data)
  }
}