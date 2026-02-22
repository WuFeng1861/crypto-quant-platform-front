import api from './index'

export interface AIGenerateStrategyRequest {
  userInput: string
}

export interface AICreateStrategyRequest {
  userInput: string
  strategyName?: string
  description?: string
}

export interface AIIndicatorParameter {
  name: string
  description: string
  paramType: 'number' | 'string' | 'boolean'
  defaultValue: string
}

export interface AIStrategyCondition {
  indicatorIndex: number
  comparisonType: 'constant' | 'indicator'
  comparedIndicatorIndex?: number
  constantValue?: string
  currentValuePath: string
  comparedValuePath: string
  operator: '>' | '>=' | '==' | '!=' | '<' | '<='
  conditionType: 'crossover' | 'value'
  action: 'buy' | 'sell'
  group: number
  priority: number
  customCode: string
}

export interface AIStrategyIndicator {
  id: number
  name: string
  description: string
  indicatorNewsIndex: number
  parameters: Array<{
    id: number
    name: string
    value: string
  }>
}

export interface AIGeneratedStrategy {
  name: string
  description: string
  positionType: 'long' | 'short' | 'both'
  buyFee: number
  sellFee: number
  liquidationThreshold: number
  takeProfitRatio: number | null
  stopLossRatio: number | null
  indicators: AIStrategyIndicator[]
  conditions: AIStrategyCondition[]
}

export interface AIGenerateStrategyResponse {
  success: boolean
  generatedStrategy: AIGeneratedStrategy
  createdIndicators: AICreatedIndicator[]
}

export interface AICreatedIndicator {
  id: number
  name: string
  description: string
  calculationCode: string
  parameters: Array<{
    id: number
    name: string
    description: string
    paramType: string
    defaultValue: string
  }>
}

export interface AICreatedStrategy {
  id: number
  name: string
  description: string
  positionType: 'long' | 'short' | 'both'
  buyFee: number
  sellFee: number
  liquidationThreshold: number
  takeProfitRatio: number | null
  stopLossRatio: number | null
  createdAt: string
  updatedAt: string
}

export interface AICreateStrategyResponse {
  success: boolean
  strategy: AICreatedStrategy
  aiGeneratedData: AIGeneratedStrategy
  createdIndicators: AICreatedIndicator[]
}

export const aiStrategyApi = {
  generate: (data: AIGenerateStrategyRequest) => {
    return api.post<AIGenerateStrategyResponse>('/ai-strategy-generator/generate', data)
  },

  create: (data: AICreateStrategyRequest) => {
    return api.post<AICreateStrategyResponse>('/ai-strategy-generator/create', data)
  }
}
