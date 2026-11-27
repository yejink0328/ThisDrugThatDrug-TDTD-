<script setup>
import { computed } from 'vue'
import { useMedStore } from '@/stores/useMedStore'
import AppIcon from '@/components/common/AppIcon.vue'
import logo from '@/assets/logo.png'

defineProps({
  sidebarOpen: { type: Boolean, default: false },
})
defineEmits(['open-sidebar'])

const med = useMedStore()
const count = computed(() => med.currentMeds.length)
</script>

<template>
  <header>
    <div class="header-inner">
      <RouterLink class="logo" to="/" aria-label="이약저약 처음 화면">
        <img :src="logo" width="56" height="56" alt="이약저약 로고" />
      </RouterLink>

      <div class="header-actions">
        <span v-if="count" class="badge">복용 중 {{ count }}개</span>
        <button
          class="icon-button"
          type="button"
          aria-label="저장한 복용약 사이드바 열기"
          aria-controls="sidebar"
          aria-haspopup="dialog"
          :aria-expanded="sidebarOpen"
          @click="$emit('open-sidebar')"
        >
          <AppIcon name="menu" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  max-width: 1040px;
  margin: auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  display: block;
  flex: none;
}
.logo img {
  display: block;
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.badge {
  padding: 4px 8px;
  background: var(--p50);
  color: var(--p500);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 560px) {
  .header-inner,
  .header-actions {
    gap: 8px;
  }
  .badge {
    padding: 4px;
  }
}
</style>