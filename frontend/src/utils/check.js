import { LEVELS, RULES } from '@/data/rules'

// 약 두 개를 비교해서 가장 높은 단계의 규칙 하나를 고릅니다. (양방향)
function checkPair(first, second) {
  let best = null

  for (const rule of RULES) {
    const matches =
      (first.tags.includes(rule.a) && second.tags.includes(rule.b)) ||
      (first.tags.includes(rule.b) && second.tags.includes(rule.a))

    if (matches && (!best || LEVELS[rule.level].rank > LEVELS[best.level].rank)) {
      best = rule
    }
  }

  return best
    ? { level: best.level, message: best.message }
    : { level: 'ok', message: '샘플 정보에서는 알려진 병용 주의 사항이 없어요.' }
}

export function checkInteractions(currentMeds, candidate) {
  if (!currentMeds.length || !candidate) {
    return { highestLevel: 'ok', pairs: [] }
  }

  const pairs = currentMeds
    .map(medicine => ({ medicine, ...checkPair(medicine, candidate) }))
    .sort((a, b) => LEVELS[b.level].rank - LEVELS[a.level].rank)

  return { highestLevel: pairs[0].level, pairs }
}