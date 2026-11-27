<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <p class="notice">
    <strong>{{ title }}</strong>
    <slot />
  </p>
</template>

<style scoped>
.notice {
  margin-top: 32px;
  padding: 16px;
  background: var(--p50);
  border: 1px solid var(--p100);
  border-left: 4px solid var(--p300);
  color: var(--body);
  font-size: 14px;
  line-height: 20px;
}
.notice strong {
  display: block;
  margin-bottom: 8px;
  color: var(--p500);
}
</style>