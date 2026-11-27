<script setup>
import { useToastStore } from '@/stores/useToastStore'

const toast = useToastStore()
</script>

<template>
  <Teleport :to="toast.host">
    <div
      class="toast"
      :class="{ on: toast.visible }"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ toast.message }}
    </div>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  max-width: calc(100% - 32px);
  width: max-content;
  z-index: 60;
  transform: translate(-50%, calc(100% + 48px));
  transition: transform .2s;
  padding: 12px 24px;
  background: var(--ink);
  color: var(--white);
  pointer-events: none;
  overflow-wrap: anywhere;
}
.toast.on {
  transform: translate(-50%, 0);
}
</style>