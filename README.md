# 이약저약 (This Drug That Drug, TDTD)

새 약을 먹기 전에, 현재 복용 중인 약과 확인된 정보를 한 화면에 모아
**확인된 사실과 확인하지 못한 범위**를 보여주고, 약사·의사 상담을 돕는 웹 서비스입니다.

> ⚠️ 이 프로젝트는 학습·포트폴리오용 시연 서비스입니다.
> 실제 복약 판단에 사용하지 마세요. 의사·약사의 상담을 대체하지 않습니다.

## 개발 기간
2026.11.23 ~ 2026.12.23

## 팀
- (김예진 / 담당 기능)
- (전제은 / 담당 기능)

## 기술 스택
- Backend: Java, Spring Boot, MySQL
- Frontend: Vue (모바일 대응 포함 SPA)
- 데이터: 공공데이터포털 e약은요, DUR API
- 협업: GitHub Projects

## 진행 상황
기획 및 초기 세팅 중

## Vue 뼈대 push 완료 - 시작 방법

git pull
cd frontend
npm install
npm run dev

-> 브라우저에서 헤더와 임시 화면이 보이면 준비 완료

#### 각자 브랜치를 만들어서 작업:
  김예진 (등록 화면) git checkout -b feature/register
  전제은 (결과·저장 화면) git checkout -b feature/result

#### git commit convention
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- chore: 파일 및 폴더 이동, README 수정 등 기타

[담당 파일]
- 김예진 : views/RegisterView.vue, 
          components/register/(MedSearch, MedList)
- 전제은 : views/ResultView.vue, 
          views/HistoryView.vue,
          components/result/(ResultSummary, PairCard, SaveForm),
          components/saved/(SavedSidebar의 목록 부분, SavedCard),
          stores/useSavedStore.js

공통(함부로 수정 금지): App.vue, 
                    router/index.js,
                    main.js,
                    assets/styles/,
                    components/common/,
                    stores/useMedStore.js,
                    stores/useToastStore.js,
                    api/, data/, utils/
→ 공통 파일을 고쳐야 하면 먼저 말하기

[지켜야 할 약속]
1. 화면 이동은 route 이름으로: router.push({ name: 'register' | 'result' | 'history' })
2. 각 화면의 <h1>에는 tabindex="-1" 유지 (화면 전환 시 포커스 이동에 필요)
3. 약 데이터는 api/drugApi.js의 함수만 호출
   searchDrugs(keyword) / getDrugsByIds(ids) / checkCombination(currentMeds, candidate)
   (모두 async. data/나 utils/check.js를 직접 import하지 않기)
4. 복용 중인 약·후보약은 useMedStore로만 다루기
   currentMeds, candidate, canCheck,
   addCurrent(drug) → 'added' | 'duplicate', removeCurrent(id),
   setCandidate(drug), clearCandidate(), setCurrentMeds(meds)
5. 안내 토스트는 useToastStore().show('문구')
6. 약 객체 모양: { id, name, ingredient, ... }

[이미 만들어 둔 공통 컴포넌트]
AppIcon(name: search|close|menu), LevelTag(level), NoticeBox(title, 본문은 slot),
MedicalCenterBadge, AppHeader, AppToast
공통 CSS 클래스(base.css): .button .ghost .icon-button .panel .caption .lead
  .page-title .empty .med-name .sr-only, 판정 색상 .dg .wn .ca .ok

[조율 사항]
- 저장 기록의 "불러오기"는 useMedStore.setCurrentMeds()를 호출
- 저장된 약 목록 표시는 MedList를 재사용: MedList에 removable prop을 두고
  :removable="false"로 사용 (MedList 완성 전에는 임시로 간단한 목록 사용)
- RegisterView의 goResult 버튼은 임시 테스트용 → 추후 실제 "먹어도 되는지 검색하러 가기" 버튼으로 교체