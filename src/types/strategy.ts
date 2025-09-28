export interface Strategy {
  id: number;
  name: string;
  description: string;
  positionType: 'long' | 'short' | 'both';
  buyFee: number;
  sellFee: number;
  liquidationThreshold: number;
  takeProfitRatio: number;
  stopLossRatio: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndicatorParameter {
  id?: number;
  parameterId: number;
  value: string;
}

export interface StrategyIndicator {
  id?: number;
  strategyId?: number;
  indicatorId: number;
  priority: number;
  parameters: IndicatorParameter[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StrategyCondition {
  id?: number;
  strategyId?: number;
  indicatorIndex?: number;
  comparisonType?: 'constant' | 'indicator';
  constantValue?: string;
  comparedIndicatorIndex?: number;
  currentValuePath: string;
  comparedValuePath?: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  conditionType: 'value' | 'crossover' | 'custom';
  action: 'buy' | 'sell' | 'none';
  group?: number;
  priority: number;
  customCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StrategyWithDetails extends Strategy {
  indicators: StrategyIndicator[];
  conditions: StrategyCondition[];
}

export interface CreateStrategyRequest {
  name: string;
  description?: string;
  positionType: 'long' | 'short' | 'both';
  buyFee: number;
  sellFee: number;
  liquidationThreshold: number;
  takeProfitRatio?: number;
  stopLossRatio?: number;
  indicators: Omit<StrategyIndicator, 'id' | 'strategyId' | 'createdAt' | 'updatedAt'>[];
  conditions: Omit<StrategyCondition, 'id' | 'strategyId' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateStrategyRequest extends Partial<CreateStrategyRequest> {
  indicators?: StrategyIndicator[];
  conditions?: StrategyCondition[];
}

export interface UpdateIndicatorRequest {
  priority?: number;
  parameters: IndicatorParameter[];
}

export interface UpdateConditionRequest {
  operator?: '>' | '<' | '>=' | '<=' | '==' | '!=';
  constantValue?: string;
  action?: 'buy' | 'sell';
  group?: number;
  priority?: number;
  customCode?: string;
}