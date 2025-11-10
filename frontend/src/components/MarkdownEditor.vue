<template>
  <div class="markdown-editor">
    <div class="flex border border-gray-300 rounded-md overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-gray-300 w-full">
        <button
          @click="activeTab = 'edit'"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'edit'
              ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
              : 'bg-white text-gray-600 hover:text-gray-900'
          ]"
        >
          Edit
        </button>
        <button
          @click="activeTab = 'preview'"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'preview'
              ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
              : 'bg-white text-gray-600 hover:text-gray-900'
          ]"
        >
          Preview
        </button>
      </div>
    </div>
    
    <!-- Editor -->
    <div v-if="activeTab === 'edit'" class="border border-t-0 border-gray-300 rounded-b-md">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :rows="rows"
        class="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm"
        :class="{ 'border-red-500': error }"
      ></textarea>
    </div>
    
    <!-- Preview -->
    <div
      v-else
      class="border border-t-0 border-gray-300 rounded-b-md px-4 py-3 min-h-[200px] prose prose-sm max-w-none"
      v-html="renderedMarkdown"
    ></div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Enter markdown content...',
  },
  rows: {
    type: Number,
    default: 10,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])

const activeTab = ref('edit')

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

const renderedMarkdown = computed(() => {
  if (!props.modelValue) {
    return '<p class="text-gray-400 italic">No content to preview</p>'
  }
  return marked.parse(props.modelValue)
})
</script>

<style>
/* GitHub-style markdown rendering */
.prose {
  color: #24292e;
  line-height: 1.6;
}

.prose h1 {
  font-size: 2em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.prose h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.prose h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
}

.prose p {
  margin-top: 0;
  margin-bottom: 16px;
}

.prose ul,
.prose ol {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.prose li {
  margin-top: 0.25em;
}

.prose code {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.prose pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  font-size: 85%;
  line-height: 1.45;
  overflow: auto;
  padding: 16px;
  margin-top: 0;
  margin-bottom: 16px;
}

.prose pre code {
  background-color: transparent;
  border: 0;
  display: inline;
  line-height: inherit;
  margin: 0;
  overflow: visible;
  padding: 0;
  word-wrap: normal;
}

.prose blockquote {
  border-left: 0.25em solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
  margin: 0 0 16px 0;
}

.prose table {
  border-collapse: collapse;
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
}

.prose table th,
.prose table td {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.prose table th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.prose table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.prose table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.prose a {
  color: #0366d6;
  text-decoration: none;
}

.prose a:hover {
  text-decoration: underline;
}

.prose img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}
</style>

