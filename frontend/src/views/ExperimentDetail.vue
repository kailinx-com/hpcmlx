<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <Button variant="outline" @click="$router.push('/')" class="mb-6">
        ← Back to Experiments
      </Button>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>

      <!-- Error State -->
      <ErrorState v-else-if="error" :error="error" @retry="fetchExperiment" />

      <!-- Experiment Details -->
      <div v-else-if="experiment" class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                {{ experiment.title || 'Unnamed Experiment' }}
              </h1>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <span>Date: <strong>{{ formatDate(experiment.date) }}</strong></span>
              </div>
              <!-- Repository Button -->
              <div v-if="experiment.github_url" class="mt-4">
                <Button variant="primary" size="md" @click="openRepository">
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                    View Repository
                  </span>
                </Button>
              </div>
            </div>
            <div v-if="authStore.isSuperuser" class="flex gap-2">
              <Button variant="outline" @click="handleEdit">
                Edit
              </Button>
              <Button variant="danger" @click="handleDelete" :disabled="deleting">
                {{ deleting ? 'Deleting...' : 'Delete' }}
              </Button>
            </div>
          </div>

          <!-- Description -->
          <div v-if="experiment.description" class="mt-4">
            <p class="text-gray-700">{{ experiment.description }}</p>
          </div>

          <!-- Tags -->
          <div v-if="experiment.tags && experiment.tags.length > 0" class="mt-4">
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in getTagNames(experiment.tags)" :key="tag"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Markdown Content Section -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Content</h2>
          </div>

          <div v-if="experiment.content" class="p-6">
            <div class="prose prose-sm max-w-none markdown-content" v-html="renderedContent"></div>
          </div>

          <div v-else class="p-6">
            <EmptyState title="No content" message="This experiment doesn't have any content yet." />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useExperimentsStore } from '../stores/experiments'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import { experimentsApi } from '../api/experiments'
import { marked } from 'marked'
import Button from '../components/Button.vue'
import Spinner from '../components/Spinner.vue'
import ErrorState from '../components/ErrorState.vue'
import EmptyState from '../components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const experimentsStore = useExperimentsStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const { currentExperiment, loading, error } = storeToRefs(experimentsStore)
const deleting = ref(false)

const experiment = computed(() => currentExperiment.value)

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

const renderedContent = computed(() => {
  if (!experiment.value?.content) {
    return ''
  }
  return marked.parse(experiment.value.content)
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const getTagNames = (tags) => {
  if (!tags || !Array.isArray(tags)) return []
  // Tags come as objects {id, name} from DRF, extract names
  return tags.map(tag => typeof tag === 'string' ? tag : tag.name).filter(Boolean)
}

const fetchExperiment = async () => {
  try {
    await experimentsStore.fetchExperiment(route.params.id)
  } catch (error) {
    console.error('Error fetching experiment:', error)
    toastStore.error('Failed to load experiment')
  }
}


const handleEdit = () => {
  router.push(`/experiments/${route.params.id}/edit`)
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this experiment? This action cannot be undone.')) {
    return
  }

  deleting.value = true
  try {
    await experimentsApi.deleteExperiment(route.params.id)
    toastStore.success('Experiment deleted successfully!')
    router.push('/')
  } catch (error) {
    const errorMessage = error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Failed to delete experiment'
    toastStore.error(errorMessage)
  } finally {
    deleting.value = false
  }
}

const openRepository = () => {
  if (experiment.value?.github_url) {
    window.open(experiment.value.github_url, '_blank', 'noopener,noreferrer')
  }
}

onMounted(async () => {
  await authStore.checkAuth()
  await fetchExperiment()
})
</script>

<style scoped>
/* GitHub-style markdown rendering */
.markdown-content {
  color: #24292e;
  line-height: 1.6;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-content :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin-top: 0.25em;
}

.markdown-content :deep(code) {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.markdown-content :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 6px;
  font-size: 85%;
  line-height: 1.45;
  overflow: auto;
  padding: 16px;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  border: 0;
  display: inline;
  line-height: inherit;
  margin: 0;
  overflow: visible;
  padding: 0;
  word-wrap: normal;
}

.markdown-content :deep(blockquote) {
  border-left: 0.25em solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
  margin: 0 0 16px 0;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
}

.markdown-content :deep(table th),
.markdown-content :deep(table td) {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.markdown-content :deep(table th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-content :deep(table tr) {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-content :deep(table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

.markdown-content :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}
</style>
