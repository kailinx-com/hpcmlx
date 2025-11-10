<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">HPC Experiments</h1>
        </div>
        <div class="flex gap-2 items-center">
          <Button v-if="authStore.isSuperuser" variant="primary" @click="goToAddExperiment">
            Add Experiment
          </Button>
          <Button v-if="authStore.isSuperuser" variant="outline" @click="handleLogout">
            Logout
          </Button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Search by name
            </label>
            <Input v-model="searchQuery" placeholder="Search experiments..." @update:modelValue="handleSearch" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Filter by tag
            </label>
            <div class="relative">
              <Input v-model="tagSearchQuery" placeholder="Search tags..." @focus="handleTagInputFocus"
                @update:modelValue="filterTags" class="w-full" />
              <!-- Dropdown -->
              <div v-if="showTagDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div v-if="filteredTags.length === 0" class="px-4 py-2 text-sm text-gray-500">
                  No tags found
                </div>
                <div v-for="tag in filteredTags" :key="tag.id" @click="selectTag(tag)"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  {{ tag.name }}
                </div>
              </div>
              <!-- Selected tags display -->
              <div v-if="selectedTags.length > 0" class="mt-2 flex flex-wrap items-center gap-2">
                <span v-for="tag in selectedTags" :key="tag.id"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ tag.name }}
                  <button @click.stop="removeTag(tag)"
                    class="text-blue-600 hover:text-blue-800 font-bold w-4 h-4 flex items-center justify-center rounded hover:bg-blue-200 transition-colors"
                    type="button" title="Remove tag">
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-start">
            <Button variant="outline" @click="clearFilters" class="w-full mt-7">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>

      <!-- Error State -->
      <ErrorState v-else-if="error" :error="error" @retry="fetchExperiments" />

      <!-- Empty State -->
      <EmptyState v-else-if="experiments.length === 0" title="No experiments found"
        message="Try adjusting your search or filters to find experiments.">
        <template #action>
          <Button variant="outline" @click="clearFilters" class="mt-4">
            Clear Filters
          </Button>
        </template>
      </EmptyState>

      <!-- Experiments Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="experiment in experiments" :key="experiment.id" class="hover:bg-gray-50 cursor-pointer"
                @click="goToExperiment(experiment.id)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ experiment.title || 'Unnamed Experiment' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ formatDate(experiment.date || experiment.created_at) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="tag in getTagNames(experiment.tags)" :key="tag"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ tag }}
                    </span>
                    <span v-if="!experiment.tags || experiment.tags.length === 0" class="text-sm text-gray-400">
                      No tags
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="outline" size="sm" @click.stop="goToExperiment(experiment.id)">
                    View
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExperimentsStore } from '../stores/experiments'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import { experimentsApi } from '../api/experiments'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Spinner from '../components/Spinner.vue'
import ErrorState from '../components/ErrorState.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const experimentsStore = useExperimentsStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const { experiments, loading, error, filters } = storeToRefs(experimentsStore)

const searchQuery = ref('')
const tagFilter = ref('')
const tagSearchQuery = ref('')
const showTagDropdown = ref(false)
const availableTags = ref([])
const filteredTags = ref([])
const selectedTags = ref([])
let searchTimeout = null

// Sync local refs with store filters
const syncFilters = () => {
  searchQuery.value = filters.value.search || ''
  tagFilter.value = filters.value.tag || ''
}

const handleSearch = (value) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    experimentsStore.setFilters({ search: value })
    fetchExperiments()
  }, 500)
}

const handleTagInputFocus = () => {
  showTagDropdown.value = true
  filterTags(tagSearchQuery.value)
}

const filterTags = (value) => {
  const query = (value || tagSearchQuery.value || '').toLowerCase()
  // Filter out already selected tags and apply search
  const available = availableTags.value.filter(tag =>
    !selectedTags.value.some(selected => selected.id === tag.id)
  )

  if (!query) {
    filteredTags.value = available
  } else {
    filteredTags.value = available.filter(tag =>
      tag.name.toLowerCase().includes(query)
    )
  }
}

const selectTag = (tag) => {
  // Check if tag is already selected
  if (!selectedTags.value.some(selected => selected.id === tag.id)) {
    selectedTags.value.push(tag)
    updateTagFilter()
    // Refresh filtered tags to remove the selected one
    filterTags(tagSearchQuery.value)
  }
  // Keep dropdown open for multiple selections, but clear search
  tagSearchQuery.value = ''
}

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t.id !== tag.id)
  updateTagFilter()
  // Refresh filtered tags to show the removed tag again
  filterTags(tagSearchQuery.value)
}

const clearTagFilter = () => {
  selectedTags.value = []
  tagFilter.value = ''
  tagSearchQuery.value = ''
  experimentsStore.setFilters({ tag: '' })
  fetchExperiments()
}

const updateTagFilter = () => {
  // For multiple tags, we'll pass them as comma-separated or handle in backend
  // For now, let's use comma-separated tag names
  const tagNames = selectedTags.value.map(t => t.name).join(',')
  tagFilter.value = tagNames
  experimentsStore.setFilters({ tag: tagNames })
  fetchExperiments()
}

const handleTagFilter = (value) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    experimentsStore.setFilters({ tag: value })
    fetchExperiments()
  }, 500)
}

const clearFilters = () => {
  searchQuery.value = ''
  clearTagFilter()
  experimentsStore.setFilters({ search: '', tag: '' })
  fetchExperiments()
}

const fetchTags = async () => {
  try {
    const response = await experimentsApi.getTags()
    const data = response.data
    availableTags.value = Array.isArray(data) ? data : (data.results || data.data || [])
    filteredTags.value = availableTags.value

    // If there's a current tag filter, find and set the selected tags
    if (filters.value.tag) {
      const tagNames = filters.value.tag.split(',').map(t => t.trim()).filter(Boolean)
      const matchingTags = availableTags.value.filter(tag =>
        tagNames.some(name => tag.name.toLowerCase() === name.toLowerCase())
      )
      if (matchingTags.length > 0) {
        selectedTags.value = matchingTags
        tagFilter.value = matchingTags.map(t => t.name).join(',')
      }
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

onMounted(async () => {
  syncFilters()

  // Check authentication status
  await authStore.checkAuth()

  // Handle async operations with proper error handling
  try {
    await Promise.all([
      fetchTags().catch(err => console.error('Error fetching tags:', err)),
      fetchExperiments().catch(err => console.error('Error fetching experiments:', err))
    ])
  } catch (error) {
    console.error('Error in onMounted:', error)
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (e) => {
  const tagFilterContainer = e.target.closest('.relative')
  if (!tagFilterContainer) {
    showTagDropdown.value = false
  }
}

const goToExperiment = (id) => {
  router.push(`/experiments/${id}`)
}

const goToAddExperiment = () => {
  router.push('/experiments/add')
}

const goToLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  await authStore.logout()
  toastStore.success('Logged out successfully')
  router.push('/')
}

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

const fetchExperiments = async () => {
  try {
    await experimentsStore.fetchExperiments()
  } catch (error) {
    toastStore.error('Failed to load experiments')
  }
}

</script>

<script>
import { storeToRefs } from 'pinia'
</script>
