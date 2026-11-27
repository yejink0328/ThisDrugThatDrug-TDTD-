<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppToast from '@/components/common/AppToast.vue'
import SavedSidebar from '@/components/saved/SavedSidebar.vue'

const route = useRoute()
const sidebarOpen = ref(false)

// 화면(주소)이 바뀌면 사이드바를 닫습니다.
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)
</script>

<template>
  <a class="skip" href="#main">본문으로 바로가기</a>
  <AppHeader :sidebar-open="sidebarOpen" @open-sidebar="sidebarOpen = true" />
  <main id="main" tabindex="-1">
    <RouterView />
  </main>
  <SavedSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
  <AppToast />
</template>

<style scoped>
main {
  max-width: 1040px;
  margin: auto;
  padding: 48px 16px;
}

@media (max-width: 560px) {
  main {
    padding: 32px 16px;
  }
}
</style>