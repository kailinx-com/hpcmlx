<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :class="[
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      className,
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

