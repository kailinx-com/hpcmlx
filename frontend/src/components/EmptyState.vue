<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="text-gray-400 mb-4">
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
          :d="iconPath"
        />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 text-center max-w-sm">{{ message }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'No data found',
  },
  message: {
    type: String,
    default: 'There is no data to display.',
  },
  iconPath: {
    type: String,
    default:
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
})
</script>

