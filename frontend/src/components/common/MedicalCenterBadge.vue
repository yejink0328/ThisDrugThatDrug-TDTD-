<template>
  <aside class="medical-center" aria-label="이약저약 메디컬센터 안내">
    <svg
      class="mascot"
      viewBox="0 0 64 80"
      role="img"
      aria-label="사다리꼴 병원 모자를 쓴 점눈 알약 캐릭터"
    >
      <rect x="12" y="24" width="40" height="48" rx="20" fill="var(--white)" />
      <path d="M12 48h40v4a20 20 0 0 1-40 0z" fill="var(--p500)" />
      <rect
        x="12" y="24" width="40" height="48" rx="20"
        fill="none" stroke="var(--ink)" stroke-width="3"
      />
      <path d="M12 48h40" stroke="var(--ink)" stroke-width="3" />
      <path
        d="M16 12h32l-4 14H20z"
        fill="var(--white)" stroke="var(--ink)" stroke-width="3"
      />
      <path d="M32 15v8m-4-4h8" stroke="var(--danger-text)" stroke-width="2" />
      <circle cx="25" cy="38" r="2.5" fill="var(--ink)" />
      <circle cx="39" cy="38" r="2.5" fill="var(--ink)" />
    </svg>
    <div>
      <strong>이약저약 메디컬센터</strong>
      <p>함께 먹기 전 꼭 확인해요</p>
    </div>
  </aside>
</template>

<style scoped>
.medical-center {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  padding: 12px 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  max-width: 100%;
  flex: none;
}
.medical-center strong {
  display: block;
  font-size: 14px;
  line-height: 20px;
  color: var(--ink);
}
.medical-center p {
  font-size: 14px;
  line-height: 20px;
  color: var(--secondary);
}
.mascot {
  width: 48px;
  height: 56px;
  flex: none;
}
</style>