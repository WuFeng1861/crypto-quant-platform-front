// 验证规则
export const validationRules = {
  required: (message = '此字段为必填项') => ({
    required: true,
    message,
    trigger: 'blur'
  }),

  minLength: (min: number, message?: string) => ({
    min,
    message: message || `最少需要 ${min} 个字符`,
    trigger: 'blur'
  }),

  maxLength: (max: number, message?: string) => ({
    max,
    message: message || `最多允许 ${max} 个字符`,
    trigger: 'blur'
  }),

  number: (message = '请输入有效的数字') => ({
    type: 'number',
    message,
    trigger: 'blur'
  }),

  positive: (message = '请输入正数') => ({
    validator: (rule: any, value: any, callback: any) => {
      if (value <= 0) {
        callback(new Error(message))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }),

  range: (min: number, max: number, message?: string) => ({
    validator: (rule: any, value: any, callback: any) => {
      if (value < min || value > max) {
        callback(new Error(message || `请输入 ${min} 到 ${max} 之间的值`))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }),

  email: (message = '请输入有效的邮箱地址') => ({
    type: 'email',
    message,
    trigger: 'blur'
  }),

  url: (message = '请输入有效的URL') => ({
    type: 'url',
    message,
    trigger: 'blur'
  }),

  code: (message = '请输入有效的代码') => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value || value.trim() === '') {
        callback(new Error(message))
      } else {
        // 简单的代码语法检查
        try {
          // 这里可以添加更复杂的代码验证逻辑
          new Function(value)
          callback()
        } catch (error) {
          callback(new Error('代码语法错误'))
        }
      }
    },
    trigger: 'blur'
  })
}

// 表单验证辅助函数
export const createFormRules = (fields: Record<string, any[]>) => {
  const rules: Record<string, any[]> = {}
  
  Object.keys(fields).forEach(field => {
    rules[field] = fields[field]
  })
  
  return rules
}

// 验证价格数据格式
export const validatePriceData = (data: any[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    return false
  }
  
  const requiredFields = [
    'timestamp',
    'openPrice',
    'highPrice',
    'lowPrice',
    'closePrice',
    'volume',
    'volumeCurrency',
    'volumeCurrencyQuote'
  ]
  
  return data.every(item => {
    return requiredFields.every(field => {
      return typeof item[field] === 'number' && !isNaN(item[field])
    })
  })
}

// 验证JSON格式
export const validateJSON = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}