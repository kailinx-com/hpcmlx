import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(false)
  
  // Computed property to check if user is superuser
  const isSuperuser = computed(() => {
    return user.value?.is_superuser === true
  })

  /**
   * Check if user is authenticated
   */
  const checkAuth = async () => {
    loading.value = true
    try {
      const response = await authApi.getCurrentUser()
      if (response.data.authenticated) {
        isAuthenticated.value = true
        user.value = response.data.user
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch (error) {
      isAuthenticated.value = false
      user.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Login with username and password
   */
  const login = async (username, password) => {
    loading.value = true
    try {
      const response = await authApi.login(username, password)
      if (response.data.success) {
        isAuthenticated.value = true
        user.value = response.data.user
        return { success: true }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    loading.value = true
    try {
      await authApi.logout()
      isAuthenticated.value = false
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local state
      isAuthenticated.value = false
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    isSuperuser,
    checkAuth,
    login,
    logout,
  }
})

