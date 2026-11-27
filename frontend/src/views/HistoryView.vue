<script>
import { defineStore } from 'pinia'
import { ref } from 'vue'

const storageKey = 'tdtd.saved-medicines.v1'

function isSavedRecord(record) {
  return record
    && typeof record.id === 'string'
    && typeof record.name === 'string'
    && typeof record.savedAt === 'string'
    && Number.isFinite(Date.parse(record.savedAt))
    && Array.isArray(record.medicines)
    && record.medicines.length > 0
    && record.medicines.every(medicine =>
      medicine
      && ['string', 'number'].includes(typeof medicine.id)
      && typeof medicine.name === 'string'
      && typeof medicine.ingredient === 'string',
    )
}

// 두 뷰에서 같은 저장 목록을 사용하기 위한 임시 스토어입니다.
// useSavedStore.js를 구현하는 단계에서 이 로직을 옮길 수 있습니다.
export const useSavedMedicines = defineStore('saved-medicines', () => {
  const records = ref([])
  const memoryOnly = ref(false)
  let sequence = 0

  // 저장소가 막혀 있거나 형식을 읽을 수 없으면 열린 앱에서만 기록을 유지합니다.
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(stored) || !stored.every(isSavedRecord)) {
      throw new Error('저장 형식 오류')
    }
    records.value = stored
  } catch {
    memoryOnly.value = true
  }

  function updateRecords(nextRecords) {
    records.value = nextRecords
    if (memoryOnly.value) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextRecords))
    } catch {
      memoryOnly.value = true
    }
  }

  function addRecord(medicines, name) {
    if (!medicines.length) return

    // 표시에 필요한 필드만 복사합니다. 불러오기에서는 ID로 최신 약 정보를 요청합니다.
    const nextNumber = records.value.reduce((number, record) => {
      const match = /^복용약 (\d+)$/.exec(record.name)
      return match ? Math.max(number, Number(match[1]) + 1) : number
    }, 1)
    const now = new Date()
    const record = {
      id: `${now.getTime()}-${sequence++}`,
      name: name.trim() || `복용약 ${nextNumber}`,
      savedAt: now.toISOString(),
      medicines: medicines.map(({ id, name, ingredient }) => ({ id, name, ingredient })),
    }

    updateRecords([record, ...records.value])
  }

  function removeRecord(id) {
    updateRecords(records.value.filter(record => record.id !== id))
  }

  return { records, memoryOnly, addRecord, removeRecord }
})
</script>

<script setup>
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDrugsByIds } from '@/api/drugApi'
import { useMedStore } from '@/stores/useMedStore'
import { useToastStore } from '@/stores/useToastStore'

defineProps({
  drawerOnly: { type: Boolean, default: false },
})

const saved = useSavedMedicines()
const med = useMedStore()
const router = useRouter()
const loadingId = ref(null)
const dateFormat = new Intl.DateTimeFormat('ko-KR')

// 저장한 약 ID를 기존 API에 넘긴 뒤, 조회된 약들을 등록 화면 스토어에 넣습니다.
async function load(record) {
  if (loadingId.value !== null) return
  loadingId.value = record.id

  try {
    const ids = record.medicines.map(medicine => medicine.id)
    const medicines = await getDrugsByIds(ids)
    if (!medicines.length) {
      toast.show('불러올 수 있는 약 정보가 없어요.')
      return
    }

    med.setCurrentMeds(medicines)
    await router.push({ name: 'register' })
    toast.show(
      medicines.length < ids.length
        ? '조회 가능한 약 정보만 불러왔어요.'
        : `‘${record.name}’을(를) 불러왔어요.`,
    )
  } catch {
    toast.show('약 정보를 불러오지 못했어요. 다시 시도해 주세요.')
  } finally {
    loadingId.value = null
  }
}
const toast = useToastStore()
const heading = ref(null)
const list = ref(null)
const drawerList = ref(null)

// 삭제된 버튼 대신 다음 기록의 삭제 버튼 또는 화면 제목에 포커스를 둡니다.
async function remove(id, fromDrawer = false) {
  const index = saved.records.findIndex(record => record.id === id)
  saved.removeRecord(id)
  toast.show('저장한 조합을 삭제했어요.')

  await nextTick()
  const container = fromDrawer ? drawerList.value : list.value
  const buttons = container?.querySelectorAll('[data-saved-delete]')
  const fallback = fromDrawer ? container?.closest('dialog')?.querySelector('.drawer-heading button') : heading.value
  const target = buttons?.[Math.min(index, buttons.length - 1)] ?? fallback
  target?.focus()
}
</script>

<template>
  <section v-if="!drawerOnly" aria-labelledby="history-title">
    <RouterLink class="button ghost" :to="{ name: 'register' }">← 처음 화면</RouterLink>
    <h1 id="history-title" ref="heading" class="page-title" tabindex="-1">저장한 조합</h1>
    <p class="lead">저장한 조합을 확인하고, 불러오거나 삭제할 수 있어요.</p>

    <p v-if="saved.memoryOnly" class="caption storage-note" role="status">
      지금은 임시 저장만 가능해요. 새로고침하거나 창을 닫으면 저장 내역이 사라질 수 있어요.
    </p>

    <div ref="list" class="saved-grid">
      <article v-for="record in saved.records" :key="record.id" class="panel saved-card">
        <h2>{{ record.name }}</h2>
        <p class="caption">
          <time :datetime="record.savedAt">{{ dateFormat.format(new Date(record.savedAt)) }}</time>
          저장 · 복용약 {{ record.medicines.length }}개
        </p>

        <!-- 기존 MedList가 완성되기 전까지 화면 안에서 읽기 전용 목록을 표시합니다. -->
        <ul class="medicines">
          <li v-for="medicine in record.medicines" :key="medicine.id">
            <p class="med-name">{{ medicine.name }}</p>
            <p class="caption">{{ medicine.ingredient }}</p>
          </li>
        </ul>

        <div class="saved-actions">
          <button
            class="button"
            type="button"
            :disabled="loadingId !== null"
            :aria-label="`${record.name} 불러오기`"
            @click="load(record)"
          >
            {{ loadingId === record.id ? '불러오는 중…' : '불러오기' }}
          </button>
          <button
            class="button ghost danger-outline"
            type="button"
            :disabled="loadingId !== null"
            :aria-label="`${record.name} 삭제`"
            data-saved-delete
            @click="remove(record.id)"
          >
            삭제
          </button>
        </div>
      </article>
      <p v-if="!saved.records.length" class="empty">저장한 복용약이 없어요. 결과 화면에서 저장해 보세요.</p>
    </div>
  </section>

  <!-- 기존 헤더가 여는 사이드바의 목록 칸에 이 화면의 저장 기록을 표시합니다. -->
  <Teleport defer to="#sidebar .drawer-list">
    <div ref="drawerList" class="tdtd-drawer-records">
      <p v-if="saved.memoryOnly" class="caption" role="status">
        이 창에서만 임시 저장돼요.
      </p>
      <p v-if="!saved.records.length" class="empty">저장한 복용약이 없어요.</p>

      <article v-for="record in saved.records" :key="record.id" class="panel drawer-record">
        <h3>{{ record.name }}</h3>
        <p class="caption">{{ record.medicines.map(medicine => medicine.name).join(', ') }}</p>
        <p class="caption">
          <time :datetime="record.savedAt">{{ dateFormat.format(new Date(record.savedAt)) }}</time>
          · 복용약 {{ record.medicines.length }}개
        </p>

        <div class="saved-actions">
          <button
            class="button"
            type="button"
            :disabled="loadingId !== null"
            :aria-label="`${record.name} 불러오기`"
            @click="load(record)"
          >
            {{ loadingId === record.id ? '불러오는 중…' : '불러오기' }}
          </button>
          <button
            class="button ghost danger-outline"
            type="button"
            :disabled="loadingId !== null"
            :aria-label="`${record.name} 삭제`"
            data-saved-delete
            @click="remove(record.id, true)"
          >
            삭제
          </button>
        </div>
      </article>
    </div>
  </Teleport>
</template>

<style scoped>
.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  align-items: start;
  gap: 24px;
  margin-top: 32px;
}

.saved-grid > .empty {
  grid-column: 1 / -1;
}

.storage-note {
  margin-top: 16px;
  color: var(--warning-text);
}

.saved-card > .caption {
  margin-top: 8px;
}

.medicines {
  display: grid;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.medicines li {
  padding: 8px 12px;
  border: 1px solid var(--border);
}

.saved-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.saved-actions .button {
  flex: 1;
}

.danger-outline {
  color: var(--danger-text);
}

.danger-outline:hover {
  background: var(--danger-light);
}

/* 기존 사이드바에 저장 목록이 들어오면 임시 안내 문구를 숨깁니다. */
:global(#sidebar .drawer-list:has(> .tdtd-drawer-records) > p.caption) {
  display: none;
}

.tdtd-drawer-records {
  display: grid;
  gap: 16px;
}

.drawer-record {
  padding: 16px;
  background: var(--bg);
}

.drawer-record h3 {
  font-size: 16px;
  line-height: 24px;
}

.drawer-record .caption {
  margin-top: 4px;
}
</style>
