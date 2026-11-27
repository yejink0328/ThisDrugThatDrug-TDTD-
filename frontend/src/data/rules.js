// 시연용 판정 규칙입니다. 임상용 데이터가 아닙니다.
export const LEVELS = {
  dg: { label: '위험', rank: 3, title: '함께 먹지 않는 것이 좋아요' },
  wn: { label: '주의 필요', rank: 2, title: '먹기 전에 확인이 필요해요' },
  ca: { label: '참고', rank: 1, title: '참고할 내용이 있어요' },
  ok: { label: '문제 없음', rank: 0, title: '알려진 문제는 없어요' },
}

// a, b: 약의 tag / level: 위험 단계 / message: 화면에 보여줄 설명
export const RULES = [
  { a: 'acet', b: 'acet', level: 'dg', message: '아세트아미노펜 성분이 겹쳐요. 하루 최대 용량을 넘기면 간 손상 위험이 있어요.' },
  { a: 'nsaid', b: 'nsaid', level: 'dg', message: '소염진통제(NSAID) 성분이 겹쳐요. 위장 출혈과 신장 부담이 커질 수 있어요.' },
  { a: 'nsaid', b: 'coag', level: 'dg', message: '출혈 위험이 크게 높아져요. 반드시 의사·약사와 먼저 상담해 주세요.' },
  { a: 'plt', b: 'coag', level: 'dg', message: '항혈전 작용이 겹쳐 출혈 위험이 커져요. 의사와 상담이 필요해요.' },
  { a: 'sed', b: 'sed', level: 'dg', message: '수면 유도 성분이 겹쳐 과도한 졸림과 호흡 억제가 생길 수 있어요.' },
  { a: 'nsaid', b: 'plt', level: 'wn', message: '출혈 위험이 올라가고, 이부프로펜·나프록센은 아스피린의 심혈관 보호 효과를 줄일 수 있어요.' },
  { a: 'acet', b: 'coag', level: 'wn', message: '아세트아미노펜을 오래 많이 먹으면 와파린 효과(INR)가 올라갈 수 있어요.' },
  { a: 'ah1', b: 'sed', level: 'wn', message: '졸림이 심해질 수 있어요. 운전·기계 조작은 피해 주세요.' },
  { a: 'ah1', b: 'ah1', level: 'wn', message: '1세대 항히스타민제가 겹쳐 졸림, 입마름, 어지러움이 심해질 수 있어요.' },
  { a: 'anta', b: 'quin', level: 'wn', message: '제산제가 항생제 흡수를 막아요. 최소 2시간 이상 간격을 두세요.' },
  { a: 'met', b: 'nsaid', level: 'ca', message: '신장 기능이 떨어진 경우 메트포르민 수치가 오를 수 있어요.' },
  { a: 'nsaid', b: 'ccb', level: 'ca', message: '소염진통제가 혈압약 효과를 약하게 할 수 있어요.' },
  { a: 'ccb', b: 'stat', level: 'ca', message: '아토르바스타틴 농도가 약간 오를 수 있어요. 근육통이 생기면 알려주세요.' },
  { a: 'caf', b: 'caf', level: 'ca', message: '카페인이 겹쳐 가슴 두근거림, 불면이 생길 수 있어요.' },
  { a: 'anta', b: 'stat', level: 'ca', message: '제산제는 스타틴과 2시간 간격을 두면 좋아요.' },
  { a: 'ppi', b: 'plt', level: 'ca', message: '오메프라졸이 클로피도그렐 효과를 줄일 수 있어요.' },
]