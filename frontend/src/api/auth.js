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
  withCredentials: true, // Important for session cookies
})

export const authApi = {
  /**
   * Login with username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise}
   */
  login(username, password) {
    const csrfToken = getCsrfToken()
    return api.post('/auth/login/', { username, password }, {
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
      withCredentials: true,
    })
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout() {
    const csrfToken = getCsrfToken()
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

