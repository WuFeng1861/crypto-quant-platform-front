import dayjs from 'dayjs'

// 格式化数字
export const formatNumber = (value: number, decimals = 2): string => {
  return value.toFixed(decimals)
}

// 格式化百分比
export const formatPercent = (value: number | string, decimals = 2, multiplyBy100 = true): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const displayValue = multiplyBy100 ? numValue * 100 : numValue
  return `${displayValue.toFixed(decimals)}%`
}

// 格式化货币
export const formatCurrency = (value: number | string, currency = 'USD', decimals = 2): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numValue)
}

// 格式化大数字
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`
  }
  return value.toString()
}

// 格式化时间
export const formatTime = (timestamp: number | string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(timestamp).format(format)
}

// 格式化相对时间
export const formatRelativeTime = (timestamp: number | string): string => {
  const now = dayjs()
  const time = dayjs(timestamp)
  const diff = now.diff(time, 'minute')

  if (diff < 1) {
    return '刚刚'
  }
  if (diff < 60) {
    return `${diff}分钟前`
  }
  if (diff < 1440) {
    return `${Math.floor(diff / 60)}小时前`
  }
  if (diff < 43200) {
    return `${Math.floor(diff / 1440)}天前`
  }

  return time.format('YYYY-MM-DD')
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 格式化回测状态
export const formatBacktestStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    running: '运行中',
    completed: '已完成',
    failed: '失败'
  }
  return statuses[status] || status
}

// 格式化仓位类型
export const formatPositionType = (type: string): string => {
  const types: Record<string, string> = {
    long: '做多',
    short: '做空',
    both: '双向'
  }
  return types[type] || type
}