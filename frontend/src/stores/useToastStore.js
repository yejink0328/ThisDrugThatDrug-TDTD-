import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)

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

  return { message, visible, show }
})