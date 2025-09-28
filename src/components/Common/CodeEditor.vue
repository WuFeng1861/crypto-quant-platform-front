<template>
  <div class="code-editor w-full">
    <div class="flex items-center justify-between mb-2">
      <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <div class="flex items-center space-x-2">
        <el-button size="small" @click="formatCode">
          {{ $t('common.format') }}
        </el-button>
        <el-button size="small" @click="copyCode">
          {{ $t('common.copy') }}
        </el-button>
      </div>
    </div>
    
    <div class="relative">
      <textarea
        ref="textareaRef"
        v-model="localValue"
        :placeholder="computedPlaceholder"
        :readonly="readonly"
        class="w-full min-h-[200px] p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
        @input="handleInput"
      />
      
      <!-- 语法高亮覆盖层 -->
      <div
        v-if="highlightedCode"
        class="absolute inset-0 p-4 font-mono text-sm pointer-events-none overflow-auto"
        v-html="highlightedCode"
      />
    </div>
    
    <div v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/github.css'
import { useI18n } from 'vue-i18n'

// 注册语言
hljs.registerLanguage('javascript', javascript)

const { t: $t } = useI18n()

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  readonly?: boolean
  language?: string
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
})

const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement>()
const localValue = ref(props.modelValue)

const computedPlaceholder = computed(() => {
  return props.placeholder || $t('common.enterCode')
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// 语法高亮
const highlightedCode = computed(() => {
  if (!localValue.value || props.readonly) return ''
  
  try {
    const result = hljs.highlight(localValue.value, { language: props.language })
    return result.value
  } catch (error) {
    console.warn($t('common.codeHighlightFailed'), error)
    return ''
  }
})

const handleInput = () => {
  emit('update:modelValue', localValue.value)
}

const formatCode = () => {
  try {
    // 简单的JavaScript格式化
    if (props.language === 'javascript') {
      // 这里可以集成更专业的代码格式化库，如 prettier
      const formatted = localValue.value
        .replace(/;/g, ';\n')
        .replace(/{/g, '{\n  ')
        .replace(/}/g, '\n}')
        .replace(/\n\s*\n/g, '\n')
      
      localValue.value = formatted
      emit('update:modelValue', formatted)
      ElMessage.success($t('common.codeFormatted'))
    }
  } catch (error) {
    ElMessage.error($t('common.codeFormatFailed'))
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(localValue.value)
    ElMessage.success($t('common.codeCopied'))
  } catch (error) {
    ElMessage.error($t('common.copyFailed'))
  }
}
</script>

<style scoped>
.code-editor textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.5;
  tab-size: 2;
}

.code-editor .hljs {
  background: transparent !important;
  padding: 0 !important;
}
</style>