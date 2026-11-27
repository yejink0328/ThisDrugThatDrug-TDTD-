import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMedStore = defineStore('med', () => {
  // 현재 복용 중인 약 목록: { id, name, ingredient, ... } 객체 배열
  const currentMeds = ref([])
  // 함께 먹을지 고민하는 약: 객체 하나 또는 null
  const candidate = ref(null)

  // 복용 중인 약이 1개 이상이고 후보약이 있으면 판정 가능
  const canCheck = computed(
    () => currentMeds.value.length > 0 && candidate.value !== null,
  )

  // 반환값: 'added' | 'duplicate' (토스트 문구는 호출하는 화면이 정함)
  function addCurrent(drug) {
    if (currentMeds.value.some(item => item.id === drug.id)) {
      return 'duplicate'
    }
    currentMeds.value.push(drug)
    return 'added'
  }

  function removeCurrent(id) {
    currentMeds.value = currentMeds.value.filter(item => item.id !== id)
  }

  function setCandidate(drug) {
    candidate.value = drug
  }

  function clearCandidate() {
    candidate.value = null
  }

  // 저장 목록 "불러오기"에서 사용. 같은 id는 한 번만 들어가게 합니다.
  function setCurrentMeds(meds) {
    const seen = new Set()
    currentMeds.value = meds.filter(drug => {
      if (seen.has(drug.id)) return false
      seen.add(drug.id)
      return true
    })
  }

  return {
    currentMeds,
    candidate,
    canCheck,
    addCurrent,
    removeCurrent,
    setCandidate,
    clearCandidate,
    setCurrentMeds,
  }
})