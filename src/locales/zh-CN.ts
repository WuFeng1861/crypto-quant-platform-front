export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    back: '返回',
    loading: '加载中...',
    noData: '暂无数据',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
    yes: '是',
    no: '否',
    all: '全部',
    name: '名称',
    description: '描述',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    actions: '操作',
    status: '状态',
    type: '类型',
    value: '值',
    parameters: '参数',
    code: '代码'
  },

  nav: {
    dashboard: '仪表板',
    indicators: '指标管理',
    strategies: '策略管理',
    backtest: '回测管理',
    tradingPairs: '交易对管理',
    timeframes: '时间框架管理',
    settings: '系统设置'
  },

  theme: {
    light: '浅色主题',
    dark: '深色主题',
    toggle: '切换主题'
  },

  language: {
    zhCN: '简体中文',
    enUS: 'English',
    toggle: '切换语言'
  },

  indicators: {
    title: '指标管理',
    list: '指标列表',
    create: '创建指标',
    edit: '编辑指标',
    detail: '指标详情',
    name: '指标名称',
    description: '指标描述',
    calculationCode: '计算代码',
    parameters: '参数列表',
    parameterName: '参数名称',
    parameterType: '参数类型',
    defaultValue: '默认值',
    addParameter: '添加参数',
    removeParameter: '移除参数',
    calculate: '计算指标',
    uploadData: '上传数据',
    useSystemData: '使用系统数据',
    selectTradingPair: '选择交易对',
    selectTimeframe: '选择时间框架',
    startTime: '开始时间',
    endTime: '结束时间',
    parameterTypes: {
      number: '数字',
      string: '字符串',
      boolean: '布尔值'
    }
  },

  strategies: {
    title: '策略管理',
    list: '策略列表',
    create: '创建策略',
    edit: '编辑策略',
    detail: '策略详情',
    name: '策略名称',
    description: '策略描述',
    positionType: '仓位类型',
    buyFee: '买入手续费',
    sellFee: '卖出手续费',
    liquidationThreshold: '爆仓阈值',
    takeProfitRatio: '止盈比例',
    stopLossRatio: '止损比例',
    indicators: '使用指标',
    conditions: '交易条件',
    addIndicator: '添加指标',
    addCondition: '添加条件',
    conditionBuilder: '条件构建器',
    customCode: '自定义代码',
    positionTypes: {
      long: '做多',
      short: '做空',
      both: '双向'
    },
    operators: {
      '>': '大于',
      '<': '小于',
      '>=': '大于等于',
      '<=': '小于等于',
      '==': '等于',
      '!=': '不等于'
    },
    actions: {
      buy: '买入',
      sell: '卖出',
      none: '无操作'
    }
  },

  backtest: {
    title: '回测管理',
    list: '回测列表',
    create: '创建回测',
    detail: '回测详情',
    result: '回测结果',
    trades: '交易记录',
    selectStrategy: '选择策略',
    selectTradingPair: '选择交易对',
    selectTimeframe: '选择时间框架',
    startTime: '开始时间',
    endTime: '结束时间',
    initialCapital: '初始资金',
    earlyStopThreshold: '提前停止阈值',
    positionDivision: '仓位分割',
    finalCapital: '最终资金',
    totalReturn: '总收益',
    returnRate: '收益率',
    maxDrawdown: '最大回撤',
    sharpeRatio: '夏普比率',
    totalTrades: '总交易次数',
    winningTrades: '盈利次数',
    losingTrades: '亏损次数',
    winRate: '胜率',
    status: {
      running: '运行中',
      completed: '已完成',
      failed: '失败'
    },
    trade: {
      timestamp: '时间',
      type: '类型',
      price: '价格',
      quantity: '数量',
      fee: '手续费',
      pnl: '盈亏'
    }
  },

  tradingPairs: {
    title: '交易对管理',
    symbol: '交易对符号',
    baseCurrency: '基础货币',
    quoteCurrency: '计价货币',
    create: '创建交易对'
  },

  timeframes: {
    title: '时间框架管理',
    name: '时间框架名称',
    intervalMs: '时间间隔(毫秒)',
    create: '创建时间框架'
  },

  validation: {
    required: '此字段为必填项',
    minLength: '最少需要 {min} 个字符',
    maxLength: '最多允许 {max} 个字符',
    min: '最小值为 {min}',
    max: '最大值为 {max}',
    email: '请输入有效的邮箱地址',
    number: '请输入有效的数字',
    positive: '请输入正数',
    range: '请输入 {min} 到 {max} 之间的值'
  }
}