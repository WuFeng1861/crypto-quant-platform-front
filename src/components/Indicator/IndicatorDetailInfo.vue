<template>
  <div class="card p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ $t('common.basicInfo') }}
    </h3>
    <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('common.name') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ indicator.name }}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('common.createdAt') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatTime(indicator.createdAt!) }}</dd>
      </div>
      <div class="md:col-span-2">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('common.description') }}</dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ indicator.description || '-' }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils/format'
import type { Indicator } from '@/types'
import { useI18n } from 'vue-i18n'

interface Props {
  indicator: Indicator
}

const props = defineProps<Props>()

const { t: $t } = useI18n()
</script>