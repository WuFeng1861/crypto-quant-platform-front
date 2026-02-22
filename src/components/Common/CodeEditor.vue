<template>
  <div class="code-editor w-full">
    <div class="flex items-center justify-between mb-2">
      <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-2">
          <el-button size="default" @click="formatCode" :icon="Edit">
            {{ $t('common.format') }}
          </el-button>
          <el-button size="default" @click="copyCode" :icon="CopyDocument">
            {{ $t('common.copy') }}
          </el-button>
        </div>
        <div class="flex items-center">
          <el-button 
            v-if="showAiGenerate" 
            type="primary" 
            size="default" 
            @click="$emit('ai-generate')"
            :loading="aiLoading"
            :icon="MagicStick"
          >
            {{ $t('indicators.aiGenerate') }}
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="code-editor-container relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden">
      <!-- 语法高亮层 -->
      <div
        v-if="highlightedCode && !props.readonly"
        ref="highlightRef"
        class="code-highlight absolute top-0 left-0 right-0 bottom-0 font-mono text-sm overflow-hidden"
        v-html="highlightedCode"
      />
      
      <!-- 输入层 -->
      <textarea
        ref="textareaRef"
        v-model="localValue"
        :placeholder="computedPlaceholder"
        :readonly="readonly"
        class="code-textarea relative w-full min-h-[200px] font-mono text-sm bg-transparent resize-vertical"
        :class="{ 'text-transparent caret-black dark:caret-white': highlightedCode && !props.readonly }"
        @input="handleInput"
        @scroll="syncScroll"
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
import { MagicStick, CopyDocument, Edit } from '@element-plus/icons-vue'

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
  showAiGenerate?: boolean
  aiLoading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'ai-generate'): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
})

const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement>()
const highlightRef = ref<HTMLDivElement>()
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

const syncScroll = () => {
  if (highlightRef.value && textareaRef.value) {
    highlightRef.value.scrollTop = textareaRef.value.scrollTop
    highlightRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
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
.code-editor-container {
  min-height: 200px;
}

.code-textarea {
  display: block;
  width: 100%;
  min-height: 200px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 2;
  letter-spacing: 0;
  word-spacing: 0;
  color: #1f2937;
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  z-index: 1;
}

.dark .code-textarea {
  color: #f3f4f6;
}

.code-highlight {
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 2;
  letter-spacing: 0;
  word-spacing: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  color: #1f2937;
  pointer-events: none;
  z-index: 0;
}

.dark .code-highlight {
  color: #f3f4f6;
}

.code-textarea.text-transparent {
  color: transparent !important;
  caret-color: #000;
}

.dark .code-textarea.text-transparent {
  caret-color: #fff;
}

.code-textarea::selection {
  background-color: rgba(59, 130, 246, 0.3);
}

.code-editor .hljs {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>