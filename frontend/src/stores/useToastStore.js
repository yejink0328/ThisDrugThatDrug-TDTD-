import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  // 토스트가 그려질 곳: 'body' 또는 열려 있는 <dialog> 요소
  const host = shallowRef('body')

  let timer = null

  function show(text, duration = 2200) {
    clearTimeout(timer)
    message.value = text
    visible.value = true

    timer = setTimeout(() => {
      visible.value = false
      message.value = ''
    }, duration)
  }

  function setHost(target) {
    host.value = target
  }

  return { message, visible, host, show, setHost }
})