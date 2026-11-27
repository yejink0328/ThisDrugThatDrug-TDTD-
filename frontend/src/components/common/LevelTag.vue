<script setup>
import { computed } from 'vue'
import { LEVELS } from '@/data/rules'

const props = defineProps({
  level: {
    type: String,
    required: true, // 'dg' | 'wn' | 'ca' | 'ok'
    validator: value => value in LEVELS,
  },
})

const label = computed(() => LEVELS[props.level].label)
</script>

<template>
  <span class="tag" :class="level">{{ label }}</span>
</template>

<style scoped>
.tag {
  padding: 4px 12px;
  background: var(--level);
  color: var(--white);
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
}
.tag.wn {
  color: var(--ink);
}
</style>