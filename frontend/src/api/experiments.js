import axios from 'axios'

const getCsrfToken = () => {
  const name = 'csrftoken'
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name) return value
  }
  return null
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const experimentsApi = {
  /**
   * Get list of experiments with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.page_size - Items per page
   * @param {string} params.search - Search by name
   * @param {string} params.tag - Filter by tag
   * @returns {Promise}
   */
  getExperiments(params = {}) {
    return api.get('/experiments/', { params })
  },

  /**
   * Get a single experiment by ID
   * @param {number|string} id - Experiment ID
   * @returns {Promise}
   */
  getExperiment(id) {
    return api.get(`/experiments/${id}/`)
  },

  /**
   * Add a new experiment
   * @param {Object} experimentData - Experiment data
   * @param {string} experimentData.title - Experiment title
   * @param {string} experimentData.description - Experiment description
   * @param {string} experimentData.date - Experiment date (YYYY-MM-DD)
   * @param {Array<number>} experimentData.tags - Array of tag IDs
   * @returns {Promise}
   */
  addExperiment(experimentData) {
    const csrfToken = getCsrfToken()
    return api.post('/experiments/', experimentData, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {}
    })
  },

  /**
   * Update an experiment
   * @param {number|string} id - Experiment ID
   * @param {Object} experimentData - Experiment data
   * @returns {Promise}
   */
  updateExperiment(id, experimentData) {
    const csrfToken = getCsrfToken()
    return api.patch(`/experiments/${id}/`, experimentData, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {}
    })
  },

  /**
   * Delete an experiment
   * @param {number|string} id - Experiment ID
   * @returns {Promise}
   */
  deleteExperiment(id) {
    const csrfToken = getCsrfToken()
    return api.delete(`/experiments/${id}/`, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {}
    })
  },

  /**
   * Get list of tags
   * @returns {Promise}
   */
  getTags() {
    return api.get('/tags/')
  },

  /**
   * Create a new tag
   * @param {Object} tagData - Tag data
   * @param {string} tagData.name - Tag name
   * @returns {Promise}
   */
  createTag(tagData) {
    const csrfToken = getCsrfToken()
    return api.post('/tags/', tagData, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {}
    })
  },
}

export default api

