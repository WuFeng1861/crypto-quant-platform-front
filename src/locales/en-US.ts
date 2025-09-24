export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    back: 'Back',
    loading: 'Loading...',
    noData: 'No Data',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    name: 'Name',
    description: 'Description',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    actions: 'Actions',
    status: 'Status',
    type: 'Type',
    value: 'Value',
    parameters: 'Parameters',
    code: 'Code'
  },

  nav: {
    dashboard: 'Dashboard',
    indicators: 'Indicators',
    strategies: 'Strategies',
    backtest: 'Backtest',
    tradingPairs: 'Trading Pairs',
    timeframes: 'Timeframes',
    settings: 'Settings'
  },

  theme: {
    light: 'Light Theme',
    dark: 'Dark Theme',
    toggle: 'Toggle Theme'
  },

  language: {
    zhCN: '简体中文',
    enUS: 'English',
    toggle: 'Toggle Language'
  },

  indicators: {
    title: 'Indicators Management',
    list: 'Indicators List',
    create: 'Create Indicator',
    edit: 'Edit Indicator',
    detail: 'Indicator Detail',
    name: 'Indicator Name',
    description: 'Description',
    calculationCode: 'Calculation Code',
    parameters: 'Parameters',
    parameterName: 'Parameter Name',
    parameterType: 'Parameter Type',
    defaultValue: 'Default Value',
    addParameter: 'Add Parameter',
    removeParameter: 'Remove Parameter',
    calculate: 'Calculate',
    uploadData: 'Upload Data',
    useSystemData: 'Use System Data',
    selectTradingPair: 'Select Trading Pair',
    selectTimeframe: 'Select Timeframe',
    startTime: 'Start Time',
    endTime: 'End Time',
    parameterTypes: {
      number: 'Number',
      string: 'String',
      boolean: 'Boolean'
    }
  },

  strategies: {
    title: 'Strategies Management',
    list: 'Strategies List',
    create: 'Create Strategy',
    edit: 'Edit Strategy',
    detail: 'Strategy Detail',
    name: 'Strategy Name',
    description: 'Description',
    positionType: 'Position Type',
    buyFee: 'Buy Fee',
    sellFee: 'Sell Fee',
    liquidationThreshold: 'Liquidation Threshold',
    takeProfitRatio: 'Take Profit Ratio',
    stopLossRatio: 'Stop Loss Ratio',
    indicators: 'Indicators',
    conditions: 'Conditions',
    addIndicator: 'Add Indicator',
    addCondition: 'Add Condition',
    conditionBuilder: 'Condition Builder',
    customCode: 'Custom Code',
    positionTypes: {
      long: 'Long',
      short: 'Short',
      both: 'Both'
    },
    operators: {
      '>': 'Greater Than',
      '<': 'Less Than',
      '>=': 'Greater Than or Equal',
      '<=': 'Less Than or Equal',
      '==': 'Equal',
      '!=': 'Not Equal'
    },
    actions: {
      buy: 'Buy',
      sell: 'Sell',
      none: 'None'
    }
  },

  backtest: {
    title: 'Backtest Management',
    list: 'Backtest List',
    create: 'Create Backtest',
    detail: 'Backtest Detail',
    result: 'Backtest Result',
    trades: 'Trade Records',
    selectStrategy: 'Select Strategy',
    selectTradingPair: 'Select Trading Pair',
    selectTimeframe: 'Select Timeframe',
    startTime: 'Start Time',
    endTime: 'End Time',
    initialCapital: 'Initial Capital',
    earlyStopThreshold: 'Early Stop Threshold',
    positionDivision: 'Position Division',
    finalCapital: 'Final Capital',
    totalReturn: 'Total Return',
    returnRate: 'Return Rate',
    maxDrawdown: 'Max Drawdown',
    sharpeRatio: 'Sharpe Ratio',
    totalTrades: 'Total Trades',
    winningTrades: 'Winning Trades',
    losingTrades: 'Losing Trades',
    winRate: 'Win Rate',
    status: {
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed'
    },
    trade: {
      timestamp: 'Time',
      type: 'Type',
      price: 'Price',
      quantity: 'Quantity',
      fee: 'Fee',
      pnl: 'P&L'
    }
  },

  tradingPairs: {
    title: 'Trading Pairs Management',
    symbol: 'Symbol',
    baseCurrency: 'Base Currency',
    quoteCurrency: 'Quote Currency',
    create: 'Create Trading Pair'
  },

  timeframes: {
    title: 'Timeframes Management',
    name: 'Timeframe Name',
    intervalMs: 'Interval (ms)',
    create: 'Create Timeframe'
  },

  validation: {
    required: 'This field is required',
    minLength: 'Minimum {min} characters required',
    maxLength: 'Maximum {max} characters allowed',
    min: 'Minimum value is {min}',
    max: 'Maximum value is {max}',
    email: 'Please enter a valid email address',
    number: 'Please enter a valid number',
    positive: 'Please enter a positive number',
    range: 'Please enter a value between {min} and {max}'
  }
}