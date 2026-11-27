<script setup>
import { useRouter } from 'vue-router'
import { useMedStore } from '@/stores/useMedStore'
import { SAMPLE_DRUGS } from '@/data/sampleDrugs'

const router = useRouter()
const med = useMedStore()

// 임시 테스트용: 팀원이 이 파일을 실제 화면으로 교체합니다.
function goResult() {
  med.setCurrentMeds([SAMPLE_DRUGS[0]])
  med.setCandidate(SAMPLE_DRUGS[6])
  router.push({ name: 'result' })
}
</script>

<template>
  <section>
    <h1 tabindex="-1">이 약, 같이 먹어도 될까요?</h1>
    <p>(등록 화면 임시 껍데기)</p>
    <button class="button" type="button" @click="goResult">테스트: 결과 화면으로</button>
    <RouterLink class="button ghost" to="/history">저장한 복용약 보기</RouterLink>
  </section>
</template>