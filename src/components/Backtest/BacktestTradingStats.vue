<template>
  <div v-if="backtest.status === 'completed'" class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ $t('backtest.tradingStats') }}</h3>
    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.totalTradesCount') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ backtest.totalTrades }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.winningTradesCount') }}</dt>
        <dd class="mt-1 text-sm text-success-600 dark:text-success-400">{{ backtest.winningTrades }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.losingTradesCount') }}</dt>
        <dd class="mt-1 text-sm text-danger-600 dark:text-danger-400">{{ backtest.losingTrades }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('backtest.winRate') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
          {{ formatPercent(backtest.winRate, 2, false) }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatPercent } from '@/utils/format'
import type { BacktestResult } from '@/types'
import { useI18n } from 'vue-i18n'

interface Props {
  backtest: BacktestResult
}

const props = defineProps<Props>()

const { t: $t } = useI18n()
</script>