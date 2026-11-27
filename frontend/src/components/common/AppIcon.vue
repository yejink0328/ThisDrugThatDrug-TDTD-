<script setup>
defineProps({
  name: { type: String, required: true }, // 'search' | 'close' | 'menu'
})
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
    <template v-if="name === 'search'">
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6" />
    </template>
    <path v-else-if="name === 'close'" d="m6 6 12 12M18 6 6 18" />
    <path v-else-if="name === 'menu'" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</template>