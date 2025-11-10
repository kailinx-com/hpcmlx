import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [],
  }),

  actions: {
    addToast(message, type = 'info') {
      const id = Date.now() + Math.random()
      const toast = {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
      }

      this.toasts.push(toast)

      // Auto remove after 5 seconds
      setTimeout(() => {
        this.removeToast(id)
      }, 5000)

      return id
    },

    removeToast(id) {
      const index = this.toasts.findIndex((t) => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    success(message) {
      return this.addToast(message, 'success')
    },

    error(message) {
      return this.addToast(message, 'error')
    },

    warning(message) {
      return this.addToast(message, 'warning')
    },

    info(message) {
      return this.addToast(message, 'info')
    },
  },
})

