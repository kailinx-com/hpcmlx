<template>
  <button
    :class="[
      'rounded-md font-medium transition-colors',
      {
        'px-2 py-1 text-sm': size === 'sm',
        'px-4 py-2': size === 'md' || !size,
        'px-6 py-3 text-lg': size === 'lg',
        'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
        'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50': variant === 'outline',
        'opacity-50 cursor-not-allowed': disabled,
      },
      className,
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>

