<script setup>
import { nextTick, ref, watch } from 'vue'
import { checkCombination } from '@/api/drugApi'
import NoticeBox from '@/components/common/NoticeBox.vue'
import LevelTag from '@/components/common/LevelTag.vue'
import SavedHistory, { useSavedMedicines } from './HistoryView.vue'
import { useToastStore } from '@/stores/useToastStore'
import { useMedStore } from '@/stores/useMedStore'

const med = useMedStore()
const result = ref(null)
const loading = ref(false)
const failed = ref(false)
const retry = ref(0)

// store의 약이 바뀌면 다시 조회합니다. 이전 요청이 늦게 끝나도 새 결과를 덮지 않습니다.
watch(
  [() => [...med.currentMeds], () => med.candidate, retry],
  async ([currentMeds, candidate], _previous, onCleanup) => {
    let active = true
    onCleanup(() => { active = false })

    result.value = null
    failed.value = false
    loading.value = false
    if (!currentMeds.length || !candidate) return

    loading.value = true
    try {
      const response = await checkCombination(currentMeds, candidate)
      if (active) result.value = response
    } catch {
      if (active) failed.value = true
    } finally {
      if (active) loading.value = false
    }
  },
  { immediate: true },
)

// 결과 표시에는 기존 API의 단계만 사용하고, 약 조합 규칙은 API에서 처리합니다.
const resultTitles = {
  dg: '샘플에서 위험 항목이 조회됐어요',
  wn: '샘플에서 주의 항목이 조회됐어요',
  ca: '샘플에서 참고 항목이 조회됐어요',
  ok: '샘플에서 주의 항목이 조회되지 않았어요',
}

const saved = useSavedMedicines()
const toast = useToastStore()
const name = ref('')
const showName = ref(false)
const nameInput = ref(null)
const submitButton = ref(null)

// 입력란이 DOM에 표시된 다음에 포커스를 옮깁니다.
async function toggleName() {
  showName.value = !showName.value
  if (showName.value) {
    await nextTick()
    nameInput.value?.focus()
  } else {
    name.value = ''
  }
}

function save() {
  if (!med.currentMeds.length) return

  saved.addRecord(med.currentMeds, name.value)
  name.value = ''
  showName.value = false
  submitButton.value?.focus()
  toast.show(saved.memoryOnly ? '현재 복용약을 임시 저장했어요.' : '현재 복용약을 저장했어요.')
}
</script>

<template>
  <section class="result-view" aria-labelledby="results-title">
    <RouterLink class="button ghost" :to="{ name: 'register' }">← 다시 등록하기</RouterLink>
    <h1 id="results-title" class="page-title" tabindex="-1">병용 확인 결과</h1>

    <!-- 조회가 끝나면 요약과 복용약별 카드를 응답 순서대로 표시합니다. -->
    <div class="result-content" :aria-busy="loading">
      <p v-if="loading" class="empty" role="status">병용 정보를 불러오는 중이에요.</p>
      <div v-else-if="failed" class="panel">
        <p role="status">결과를 불러오지 못했어요.</p>
        <button class="button ghost retry" type="button" @click="retry++">다시 시도</button>
      </div>
      <template v-else-if="result?.pairs.length">
        <section class="panel summary" :class="result.highestLevel">
          <p class="caption">샘플 조회 · {{ med.candidate.name }}</p>
          <h2>{{ resultTitles[result.highestLevel] }}</h2>
          <p>조회 범위는 샘플 규칙이며, 실제 복용 안전성은 확인할 수 없어요.</p>
        </section>

        <article
          v-for="pair in result.pairs"
          :key="pair.medicine.id"
          class="pair"
          :class="pair.level"
        >
          <div class="pair-top">
            <!-- ok는 샘플 규칙에서 항목이 조회되지 않았다는 뜻입니다. -->
            <span v-if="pair.level === 'ok'" class="unconfirmed-tag">샘플 항목 미조회</span>
            <LevelTag v-else :level="pair.level" />
            <h3 class="med-name">{{ pair.medicine.name }} + {{ med.candidate.name }}</h3>
          </div>
          <p v-if="pair.level === 'ok'">이 조합의 실제 복용 안전성은 확인되지 않았어요.</p>
          <p v-else>{{ pair.message }}</p>
        </article>
      </template>
      <p v-else class="empty">표시할 조합이 없어요. 복용약과 후보약을 확인해 주세요.</p>
    </div>

    <!-- 저장 대상은 첨부본과 같이 현재 복용약입니다. -->
    <form v-if="med.currentMeds.length" class="panel save-panel" aria-labelledby="save-title" @submit.prevent="save">
      <h2 id="save-title">현재 복용약 저장</h2>
      <p class="caption">저장하면 다음에 복용 중인 약을 바로 불러올 수 있어요.</p>
  
      <div id="saved-name-option" v-show="showName" class="name-option">
        <label for="saved-name">저장 이름 (선택)</label>
        <input
          id="saved-name"
          ref="nameInput"
          v-model="name"
          type="text"
          maxlength="20"
          placeholder="예: 아침 복용약"
          :disabled="!showName"
        />
      </div>
  
      <div class="save-controls">
        <button ref="submitButton" class="button" type="submit">저장하기</button>
        <button
          class="button ghost"
          type="button"
          :aria-expanded="showName"
          aria-controls="saved-name-option"
          @click="toggleName"
        >
          {{ showName ? '저장 이름 사용 안 함' : '저장 이름 추가 (선택)' }}
        </button>
        <RouterLink class="button ghost" :to="{ name: 'history' }">저장 내역 보기</RouterLink>
      </div>
    </form>

    <NoticeBox title="시연용 샘플 결과예요.">
      실제 복약 판단에 사용하지 마세요. 복용 전 의사·약사와 상담해 주세요.
    </NoticeBox>
  </section>

  <!-- 저장 내역 화면과 같은 사이드바 목록을 사용합니다. -->
  <SavedHistory drawer-only />
</template>

<style scoped>
.result-view {
  max-width: 720px;
  margin-inline: auto;
}

.result-content {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.retry {
  margin-top: 12px;
}

.summary {
  border: 0;
  border-left: 4px solid var(--level, var(--border));
  background: var(--light, var(--bg));
  color: var(--text, var(--body));
}

.summary.ok {
  --level: var(--p300);
  --light: var(--p50);
}

.summary h2 {
  margin-block: 8px;
  color: inherit;
}

.summary .caption {
  color: inherit;
  font-weight: 500;
}

.pair {
  padding: 16px;
  border: 1px solid var(--border);
  border-left: 4px solid var(--level, var(--border));
  background: var(--white);
}

.pair.ok {
  --level: var(--p300);
}

.pair-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 8px;
}

.pair .med-name {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}

.unconfirmed-tag {
  padding: 4px 12px;
  background: var(--p50);
  color: var(--caution-text);
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
}

.save-panel {
  margin-top: 32px;
}

.name-option {
  max-width: 440px;
  margin-top: 16px;
}

.name-option label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.name-option input {
  width: 100%;
  min-height: 52px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--ink);
}

.save-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 560px) {
  .save-controls {
    flex-direction: column;
  }
}
</style>
