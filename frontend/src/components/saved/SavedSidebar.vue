<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import { useToastStore } from '@/stores/useToastStore'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const router = useRouter()
const toast = useToastStore()

const dialogEl = ref(null)
const slidIn = ref(false) // 슬라이드 인 애니메이션용 클래스

watch(
  () => props.open,
  isOpen => {
    const dialog = dialogEl.value
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) dialog.showModal()
      document.body.style.overflow = 'hidden'
      toast.setHost(dialog)
      requestAnimationFrame(() => {
        if (dialog.open) slidIn.value = true
      })
    } else {
      slidIn.value = false
      toast.setHost('body')
      if (dialog.open) dialog.close()
      document.body.style.overflow = ''
    }
  },
)

// 사이드바 바깥(어두운 배경)을 눌렀을 때 닫습니다.
function onDialogClick(event) {
  if (event.target !== dialogEl.value) return

  const bounds = dialogEl.value.getBoundingClientRect()
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom

  if (outside) emit('close')
}

function goHistory() {
  emit('close')
  router.push({ name: 'history' })
}

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  toast.setHost('body')
})
</script>

<template>
  <dialog
    id="sidebar"
    ref="dialogEl"
    :class="{ open: slidIn }"
    aria-labelledby="sidebar-title"
    @cancel.prevent="emit('close')"
    @click="onDialogClick"
  >
    <div class="drawer-heading">
      <h2 id="sidebar-title">저장한 복용약</h2>
      <button
        class="icon-button"
        type="button"
        aria-label="사이드바 닫기"
        autofocus
        @click="emit('close')"
      >
        <AppIcon name="close" />
      </button>
    </div>

    <button class="button ghost full" type="button" @click="goHistory">
      상세 내역 페이지로 이동
    </button>

    <div class="drawer-list">
      <!-- TODO(팀원 B): useSavedStore의 저장 목록을 여기에 그립니다. -->
      <p class="caption">(저장 목록은 팀원 B가 채웁니다)</p>
      
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  position: fixed;
  inset: 0 0 0 auto;
  width: 320px;
  max-width: 88vw;
  height: 100dvh;
  max-height: 100%;
  margin: 0;
  padding: 16px;
  overflow: auto;
  background: var(--white);
  color: var(--body);
  border: 0;
  border-left: 1px solid var(--border);
  transform: translateX(100%);
  transition: transform .2s;
}
dialog.open {
  transform: none;
}
dialog::backdrop {
  background: rgba(32, 32, 39, .45);
}
.drawer-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.full {
  width: 100%;
}
.drawer-list {
  margin-top: 24px;
  display: grid;
  gap: 16px;
}
</style>