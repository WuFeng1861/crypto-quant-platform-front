<template>
  <div class="profit-chart">
    <v-chart 
      ref="chartRef"
      class="chart" 
      :option="chartOption" 
      :loading="loading"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { Trade } from '@/types'
import { formatCurrency, formatTime } from '@/utils/format'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
])

interface Props {
  trades: Trade[]
  initialCapital: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const chartRef = ref()

// 计算收益数据
const profitData = computed(() => {
  if (!props.trades.length) return []
  
  const data: Array<{ time: string, balance: number, profit: number, profitRate: number }> = []
  let currentBalance = props.initialCapital
  
  // 添加初始点
  data.push({
    time: props.trades[0]?.timestamp || new Date().toISOString(),
    balance: currentBalance,
    profit: 0,
    profitRate: 0
  })
  
  // 计算每笔交易后的余额变化
  props.trades.forEach(trade => {
    const tradeProfit = parseFloat(trade.profit || '0')
    currentBalance += tradeProfit
    
    const profit = currentBalance - props.initialCapital
    const profitRate = (profit / props.initialCapital) * 100
    
    data.push({
      time: trade.timestamp,
      balance: currentBalance,
      profit,
      profitRate
    })
  })
  
  return data
})

// ECharts 配置
const chartOption = computed(() => {
  const data = profitData.value
  
  if (!data.length) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#999',
          fontSize: 14
        }
      }
    }
  }
  
  const times = data.map(item => new Date(item.time).getTime())
  const balances = data.map(item => item.balance)
  const profits = data.map(item => item.profit)
  const profitRates = data.map(item => item.profitRate)
  
  return {
    title: {
      text: '收益曲线',
      left: 'left',
      textStyle: {
        color: '#374151',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex
        const item = data[dataIndex]
        return `
          <div style="padding: 8px;">
            <div style="margin-bottom: 4px; font-weight: bold;">
              ${formatTime(item.time)}
            </div>
            <div style="margin-bottom: 2px;">
              <span style="color: #3b82f6;">● 账户余额:</span> ${formatCurrency(item.balance)}
            </div>
            <div style="margin-bottom: 2px;">
              <span style="color: ${item.profit >= 0 ? '#10b981' : '#ef4444'};">● 总盈亏:</span> 
              <span style="color: ${item.profit >= 0 ? '#10b981' : '#ef4444'};">
                ${formatCurrency(item.profit)}
              </span>
            </div>
            <div>
              <span style="color: ${item.profitRate >= 0 ? '#10b981' : '#ef4444'};">● 收益率:</span> 
              <span style="color: ${item.profitRate >= 0 ? '#10b981' : '#ef4444'};">
                ${item.profitRate.toFixed(2)}%
              </span>
            </div>
          </div>
        `
      }
    },
    legend: {
      data: ['账户余额', '累计盈亏'],
      top: 30,
      textStyle: {
        color: '#374151'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      },
      right: 20,
      top: 30
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (value: number) => {
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}\n${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        },
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '账户余额',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      {
        type: 'value',
        name: '累计盈亏',
        position: 'right',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        height: 30,
        bottom: 20
      }
    ],
    series: [
      {
        name: '账户余额',
        type: 'line',
        yAxisIndex: 0,
        data: times.map((time, index) => [time, balances[index]]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#3b82f6',
          width: 2
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        }
      },
      {
        name: '累计盈亏',
        type: 'line',
        yAxisIndex: 1,
        data: times.map((time, index) => [time, profits[index]]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#10b981',
          width: 2
        },
        itemStyle: {
          color: '#10b981'
        }
      }
    ]
  }
})

// 监听数据变化，重新渲染图表
watch(() => props.trades, () => {
  if (chartRef.value) {
    chartRef.value.resize()
  }
}, { deep: true })

onMounted(() => {
  // 确保图表正确渲染
  setTimeout(() => {
    if (chartRef.value) {
      chartRef.value.resize()
    }
  }, 100)
})
</script>

<style scoped>
.profit-chart {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>