<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from './components/ToastContainer.vue'
</script>

