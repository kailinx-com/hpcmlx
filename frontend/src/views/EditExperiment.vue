<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Experiment</h1>
                <p class="text-gray-600">Update experiment details</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <Spinner size="lg" />
            </div>

            <!-- Error State -->
            <ErrorState v-else-if="error" :error="error" @retry="fetchExperiment" />

            <!-- Form -->
            <div v-else class="bg-white rounded-lg shadow p-6">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- GitHub URL Field -->
                    <div>
                        <label for="github_url" class="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Repository URL
                        </label>
                        <div class="flex gap-2">
                            <Input id="github_url" v-model="formData.github_url"
                                placeholder="https://github.com/owner/repo" class="flex-1"
                                :class="{ 'border-red-500': errors.github_url }" />
                            <Button type="button" variant="outline" @click="fetchReadme"
                                :disabled="!formData.github_url.trim() || fetchingReadme">
                                {{ fetchingReadme ? 'Fetching...' : 'Fetch README' }}
                            </Button>
                        </div>
                        <p v-if="errors.github_url" class="mt-1 text-sm text-red-600">{{ errors.github_url }}</p>
                        <p v-if="readmeError" class="mt-1 text-sm text-red-600">{{ readmeError }}</p>
                    </div>

                    <!-- Title Field -->
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                            Title <span class="text-red-500">*</span>
                        </label>
                        <Input id="title" v-model="formData.title" placeholder="Enter experiment title"
                            :class="{ 'border-red-500': errors.title }" />
                        <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                    </div>

                    <!-- Description Field -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea id="description" v-model="formData.description" rows="4"
                            placeholder="Enter experiment description"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                    </div>

                    <!-- Date Field -->
                    <div>
                        <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                            Date <span class="text-red-500">*</span>
                        </label>
                        <Input id="date" v-model="formData.date" type="date"
                            :class="{ 'border-red-500': errors.date }" />
                        <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
                    </div>

                    <!-- Tags Field -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>

                        <!-- Add New Tag -->
                        <div class="mb-4 flex gap-2">
                            <Input v-model="newTagName" placeholder="Enter new tag name" class="flex-1"
                                @keyup.enter="handleAddTag" />
                            <Button type="button" variant="outline" @click="handleAddTag"
                                :disabled="!newTagName.trim() || addingTag">
                                {{ addingTag ? 'Adding...' : 'Add Tag' }}
                            </Button>
                        </div>

                        <!-- Existing Tags -->
                        <div v-if="loadingTags" class="text-sm text-gray-500">Loading tags...</div>
                        <div v-else-if="availableTags.length === 0" class="text-sm text-gray-500">
                            No tags available. Add a tag above.
                        </div>
                        <div v-else class="space-y-2">
                            <div v-for="tag in availableTags" :key="tag.id" class="flex items-center">
                                <input :id="`tag-${tag.id}`" type="checkbox" :value="tag.id" v-model="formData.tags"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label :for="`tag-${tag.id}`" class="ml-2 text-sm text-gray-700">
                                    {{ tag.name }}
                                </label>
                            </div>
                        </div>
                        <p v-if="errors.tags" class="mt-1 text-sm text-red-600">{{ errors.tags }}</p>
                    </div>

                    <!-- GitHub URL Field -->
                    <div>
                        <label for="github_url" class="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Repository URL
                        </label>
                        <div class="flex gap-2">
                            <Input id="github_url" v-model="formData.github_url"
                                placeholder="https://github.com/owner/repo" class="flex-1"
                                :class="{ 'border-red-500': errors.github_url }" />
                            <Button type="button" variant="outline" @click="fetchReadme"
                                :disabled="!formData.github_url.trim() || fetchingReadme">
                                {{ fetchingReadme ? 'Fetching...' : 'Fetch README' }}
                            </Button>
                        </div>
                        <p v-if="errors.github_url" class="mt-1 text-sm text-red-600">{{ errors.github_url }}</p>
                        <p v-if="readmeError" class="mt-1 text-sm text-red-600">{{ readmeError }}</p>
                    </div>

                    <!-- Markdown Content Field -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Content (Markdown)
                        </label>
                        <MarkdownEditor v-model="formData.content"
                            placeholder="Enter markdown content for your experiment..." :rows="15"
                            :error="errors.content" />
                        <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
                    </div>

                    <!-- Error Message -->
                    <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-md p-4">
                        <p class="text-sm text-red-800">{{ submitError }}</p>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" @click="handleCancel" :disabled="submitting">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" :disabled="submitting">
                            <span v-if="submitting">Updating...</span>
                            <span v-else>Update Experiment</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { experimentsApi } from '../api/experiments'
import { useToastStore } from '../stores/toast'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import Spinner from '../components/Spinner.vue'
import ErrorState from '../components/ErrorState.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

const formData = ref({
    title: '',
    description: '',
    date: '',
    tags: [],
    github_url: '',
    content: '', // Markdown content
})

const errors = ref({})
const submitError = ref('')
const submitting = ref(false)
const loading = ref(true)
const error = ref(null)
const loadingTags = ref(false)
const availableTags = ref([])
const newTagName = ref('')
const addingTag = ref(false)
const fetchingReadme = ref(false)
const readmeError = ref('')

const fetchExperiment = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await experimentsApi.getExperiment(route.params.id)
        const exp = response.data

        // Format date for input field (YYYY-MM-DD)
        const dateStr = exp.date || exp.created_at
        const formattedDate = dateStr ? new Date(dateStr).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

        formData.value = {
            title: exp.title || '',
            description: exp.description || '',
            date: formattedDate,
            tags: exp.tags ? exp.tags.map(tag => tag.id || tag) : [],
            github_url: exp.github_url || '',
            content: exp.content || '', // Markdown content
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to load experiment'
        toastStore.error('Failed to load experiment')
    } finally {
        loading.value = false
    }
}

const fetchTags = async () => {
    loadingTags.value = true
    try {
        const response = await experimentsApi.getTags()
        const data = response.data
        availableTags.value = Array.isArray(data) ? data : (data.results || data.data || [])
    } catch (error) {
        console.error('Failed to fetch tags:', error)
        availableTags.value = []
    } finally {
        loadingTags.value = false
    }
}

const validateForm = () => {
    errors.value = {}
    let isValid = true

    if (!formData.value.title || formData.value.title.trim() === '') {
        errors.value.title = 'Title is required'
        isValid = false
    }

    if (!formData.value.date) {
        errors.value.date = 'Date is required'
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    submitting.value = true
    submitError.value = ''

    try {
        const payload = {
            title: formData.value.title.trim(),
            description: formData.value.description.trim() || null,
            date: formData.value.date,
            tag_ids: formData.value.tags,
            github_url: formData.value.github_url.trim() || null,
            content: formData.value.content.trim() || null, // Markdown content
        }

        await experimentsApi.updateExperiment(route.params.id, payload)

        toastStore.success('Experiment updated successfully!')
        router.push(`/experiments/${route.params.id}`)
    } catch (error) {
        const errorMessage = error.response?.data?.error ||
            error.response?.data?.message ||
            Object.values(error.response?.data || {}).flat().join(', ') ||
            error.message ||
            'Failed to update experiment'

        if (error.response?.status === 400 && error.response?.data) {
            const backendErrors = error.response.data
            errors.value = {}

            Object.keys(backendErrors).forEach(key => {
                const errorValue = backendErrors[key]
                errors.value[key] = Array.isArray(errorValue) ? errorValue.join(', ') : errorValue
            })
        } else {
            submitError.value = errorMessage
        }

        toastStore.error('Failed to update experiment')
    } finally {
        submitting.value = false
    }
}

const parseGitHubUrl = (url) => {
    try {
        // Handle various GitHub URL formats:
        // https://github.com/owner/repo
        // https://github.com/owner/repo.git
        // github.com/owner/repo
        const cleanUrl = url.trim().replace(/\.git$/, '')
        const match = cleanUrl.match(/github\.com[/:]([^/]+)\/([^/]+)/)
        if (match) {
            return { owner: match[1], repo: match[2] }
        }
        return null
    } catch (error) {
        return null
    }
}

const fetchReadme = async () => {
    if (!formData.value.github_url.trim()) {
        readmeError.value = 'Please enter a GitHub URL'
        return
    }

    fetchingReadme.value = true
    readmeError.value = ''

    try {
        const repoInfo = parseGitHubUrl(formData.value.github_url)
        if (!repoInfo) {
            readmeError.value = 'Invalid GitHub URL format. Use: https://github.com/owner/repo'
            return
        }

        // Fetch repository info, README, and latest commit in parallel
        const [repoResponse, readmeResponse, commitsResponse] = await Promise.all([
            fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
            }),
            fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/readme`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
            }),
            fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=1`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
            })
        ])

        if (!repoResponse.ok) {
            if (repoResponse.status === 404) {
                readmeError.value = 'Repository not found'
            } else if (repoResponse.status === 403) {
                readmeError.value = 'Rate limit exceeded or repository is private'
            } else {
                readmeError.value = `Failed to fetch repository: ${repoResponse.statusText}`
            }
            return
        }

        if (!readmeResponse.ok) {
            if (readmeResponse.status === 404) {
                readmeError.value = 'README not found in this repository'
            } else if (readmeResponse.status === 403) {
                readmeError.value = 'Rate limit exceeded or repository is private'
            } else {
                readmeError.value = `Failed to fetch README: ${readmeResponse.statusText}`
            }
            return
        }

        const repoData = await repoResponse.json()
        const readmeData = await readmeResponse.json()

        // Get latest commit date
        let latestCommitDate = null
        if (commitsResponse.ok) {
            const commitsData = await commitsResponse.json()
            if (commitsData && commitsData.length > 0 && commitsData[0].commit) {
                latestCommitDate = commitsData[0].commit.committer?.date || commitsData[0].commit.author?.date
            }
        }

        // Decode base64 content with proper UTF-8 handling
        const base64Content = readmeData.content.replace(/\s/g, '')
        const binaryString = atob(base64Content)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        const content = new TextDecoder('utf-8').decode(bytes)

        // Extract title from README (first H1 or repo name) - only if title is empty
        if (!formData.value.title) {
            // Try to extract title from README (first H1)
            const h1Match = content.match(/^#\s+(.+)$/m)
            if (h1Match) {
                formData.value.title = h1Match[1].trim()
            } else {
                // Fallback to repository name
                formData.value.title = repoData.name || `${repoInfo.owner}/${repoInfo.repo}`
            }
        }

        // Extract date from latest commit - always update when fetching from GitHub
        if (latestCommitDate) {
            formData.value.date = new Date(latestCommitDate).toISOString().split('T')[0]
        } else {
            // Fallback to repository created_at or updated_at if no commits
            const repoDate = repoData.created_at || repoData.updated_at
            if (repoDate) {
                formData.value.date = new Date(repoDate).toISOString().split('T')[0]
            }
        }

        // Populate content field
        formData.value.content = content

        toastStore.success('Repository data fetched successfully!')
    } catch (error) {
        console.error('Error fetching repository data:', error)
        readmeError.value = error.message || 'Failed to fetch repository data. Please check the URL and try again.'
        toastStore.error('Failed to fetch repository data')
    } finally {
        fetchingReadme.value = false
    }
}

const handleAddTag = async () => {
    const tagName = newTagName.value.trim()
    if (!tagName) return

    // Check if tag already exists
    const existingTag = availableTags.value.find(tag => tag.name.toLowerCase() === tagName.toLowerCase())
    if (existingTag) {
        // If tag exists, just select it
        if (!formData.value.tags.includes(existingTag.id)) {
            formData.value.tags.push(existingTag.id)
        }
        newTagName.value = ''
        toastStore.success('Tag already exists and has been selected')
        return
    }

    addingTag.value = true
    try {
        const response = await experimentsApi.createTag({ name: tagName })
        const newTag = response.data

        // Add to available tags
        availableTags.value.push(newTag)

        // Automatically select the new tag
        formData.value.tags.push(newTag.id)

        // Clear input
        newTagName.value = ''

        toastStore.success('Tag created successfully!')
    } catch (error) {
        const errorMessage = error.response?.data?.error ||
            error.response?.data?.message ||
            Object.values(error.response?.data || {}).flat().join(', ') ||
            error.message ||
            'Failed to create tag'
        toastStore.error(errorMessage)
    } finally {
        addingTag.value = false
    }
}

const handleCancel = () => {
    router.push(`/experiments/${route.params.id}`)
}

onMounted(async () => {
    await Promise.all([fetchExperiment(), fetchTags()])
})
</script>
