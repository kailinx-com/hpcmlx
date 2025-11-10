<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="text-red-400 mb-4">
      <svg
        class="w-16 h-16 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
    <p class="text-sm text-gray-500 text-center max-w-sm mb-4">{{ error || 'An error occurred while loading data.' }}</p>
    <Button @click="$emit('retry')">Retry</Button>
  </div>
</template>

<script setup>
import Button from './Button.vue'

defineProps({
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['retry'])
</script>

