import axios from 'axios'

// Cache for CSRF token
let csrfTokenCache = null

const getCsrfToken = async () => {
  // Try to get from cookie first (for backwards compatibility)
  const name = 'csrftoken'
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name && value) return value
  }
  
  // If not in cookie (HttpOnly), fetch from API
  if (!csrfTokenCache) {
    try {
      const response = await api.get('/auth/csrf-token/', {
        withCredentials: true,
      })
      csrfTokenCache = response.data.csrfToken
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error)
      return null
    }
  }
  
  return csrfTokenCache
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
})

export const authApi = {
  /**
   * Login with username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise}
   */
  async login(username, password) {
    const csrfToken = await getCsrfToken()
    return api.post('/auth/login/', { username, password }, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
      withCredentials: true,
    })
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  async logout() {
    const csrfToken = await getCsrfToken()
    // Clear cache on logout
    csrfTokenCache = null
    return api.post('/auth/logout/', {}, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
      withCredentials: true,
    })
  },

  /**
   * Get current authenticated user
   * @returns {Promise}
   */
  getCurrentUser() {
    return api.get('/auth/current-user/', {
      withCredentials: true,
    })
  },
}

export default authApi

