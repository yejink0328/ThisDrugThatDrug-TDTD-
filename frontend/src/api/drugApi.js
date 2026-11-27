import { SAMPLE_DRUGS } from '@/data/sampleDrugs'
import { checkInteractions } from '@/utils/check'

// 실제 서버처럼 응답이 조금 늦게 오도록 흉내 냅니다.
const wait = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms))

// 약 이름 또는 성분으로 검색합니다. (최대 8개)
export async function searchDrugs(keyword) {
  await wait()

  const query = keyword.trim().toLowerCase()
  if (!query) return []

  return SAMPLE_DRUGS.filter(
    drug =>
      drug.name.toLowerCase().includes(query) ||
      drug.ingredient.toLowerCase().includes(query),
  ).slice(0, 8)
}

// 저장된 id 목록으로 약 정보를 가져옵니다. (저장 목록 불러오기, 상세 표시용)
export async function getDrugsByIds(ids) {
  await wait()

  return ids
    .map(id => SAMPLE_DRUGS.find(drug => drug.id === id))
    .filter(Boolean)
}

// 복용 중인 약들과 후보약의 병용 판정 결과를 가져옵니다.
export async function checkCombination(currentMeds, candidate) {
  await wait()

  return checkInteractions(currentMeds, candidate)
}