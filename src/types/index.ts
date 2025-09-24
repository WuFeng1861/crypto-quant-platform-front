// API 响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 价格数据
export interface PriceData {
  timestamp: number
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
  volumeCurrency: number
  volumeCurrencyQuote: number
}

// 指标相关
export interface IndicatorParameter {
  id?: number
  name: string
  description?: string
  defaultValue?: string
  paramType: 'number' | 'string' | 'boolean'
}

export interface Indicator {
  id?: number
  name: string
  description?: string
  calculationCode: string
  parameters: IndicatorParameter[]
  createdAt?: string
  updatedAt?: string
}

export interface IndicatorCalculateRequest {
  priceData: PriceData[]
  parameters: Record<string, any>
}

export interface IndicatorCalculateWithDataRequest {
  pairId: number
  timeframeId: number
  startTime: number
  endTime: number
  parameters: Record<string, any>
}

// 交易对
export interface TradingPair {
  id: number
  symbol: string
  baseAsset: string
  quoteAsset: string
  createdAt?: string
}

// 时间框架
export interface Timeframe {
  id: number
  name: string
  description?: string
  intervalMs: number
  createdAt?: string
}

// 策略相关
export interface StrategyIndicator {
  indicatorId: number
  priority?: number
  parameters: Array<{
    parameterId: number
    value: string
  }>
}

export interface StrategyCondition {
  indicatorIndex: number
  comparisonType: 'indicator' | 'constant'
  comparedIndicatorIndex?: number
  constantValue?: string
  currentValuePath?: string
  comparedValuePath?: string
  operator: '>' | '<' | '>=' | '<=' | '==' | '!='
  conditionType: string
  action: 'buy' | 'sell' | 'none'
  group?: number
  priority?: number
  customCode?: string
}

export interface Strategy {
  id?: number
  name: string
  description?: string
  positionType: 'long' | 'short' | 'both'
  buyFee: number
  sellFee: number
  liquidationThreshold: number
  takeProfitRatio?: number
  stopLossRatio?: number
  indicators: StrategyIndicator[]
  conditions: StrategyCondition[]
  createdAt?: string
  updatedAt?: string
}

export interface StrategyWithDetails extends Strategy {
  indicatorCount: number
  conditionCount: number
}

// 回测相关
export enum BacktestStatus {
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface BacktestRequest {
  strategyId: number
  pairId: number
  timeframeId: number
  startTime: string
  endTime: string
  initialCapital: number
  earlyStopThreshold?: number
  positionDivision?: number
}

export interface BacktestCreateResponse {
  success: boolean
  message: string
  backtestId?: number
}

export interface Trade {
  id: number
  timestamp: number
  type: 'buy' | 'sell'
  price: number
  quantity: number
  fee: number
  pnl?: number
}

export interface BacktestResult {
  id: number
  strategyId: number
  pairId: number
  timeframeId: number
  startTime: string
  endTime: string
  initialCapital: string
  finalCapital: string
  totalProfit: string
  profitRate: string
  maxDrawdown: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: string
  sharpeRatio: string
  earlyStopped: boolean
  earlyStopReason?: string | null
  earlyStopTime?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

// 用户设置
export interface UserSettings {
  theme: 'light' | 'dark'
  locale: 'zh-CN' | 'en-US'
}