import { defineStore } from 'pinia'
import { experimentsApi } from '../api/experiments'

export const useExperimentsStore = defineStore('experiments', {
  state: () => ({
    experiments: [],
    currentExperiment: null,
    runs: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      tag: '',
    },
  }),

  actions: {
    async fetchExperiments() {
      this.loading = true
      this.error = null

      try {
        const queryParams = {
          ...(this.filters.search && { search: this.filters.search }),
          ...(this.filters.tag && { tag: this.filters.tag }),
        }

        const response = await experimentsApi.getExperiments(queryParams)
        const data = response.data

        // DRF returns array directly when no pagination
        this.experiments = Array.isArray(data) ? data : (data.results || data.data || [])
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch experiments'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchExperiment(id) {
      this.loading = true
      this.error = null

      try {
        const response = await experimentsApi.getExperiment(id)
        this.currentExperiment = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch experiment'
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
  },
})

