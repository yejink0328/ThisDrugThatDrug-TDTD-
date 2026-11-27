import { nextTick } from 'vue'
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import { useMedStore } from '@/stores/useMedStore'
import RegisterView from '@/views/RegisterView.vue'
import ResultView from '@/views/ResultView.vue'
import HistoryView from '@/views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'register', component: RegisterView },
    {
      path: '/result',
      name: 'result',
      component: ResultView,
      // 새로고침으로 상태가 사라진 채 들어오면 처음 화면으로 돌려보냅니다.
      beforeEnter: () => {
        const med = useMedStore()
        return med.canCheck ? true : { name: 'register' }
      },
    },
    { path: '/history', name: 'history', component: HistoryView },
    { path: '/:pathMatch(.*)*', redirect: { name: 'register' } },
  ],
})

// 화면이 바뀌면 제목(h1)으로 포커스를 옮깁니다. (프로토타입의 show() 동작)
router.afterEach((to, from) => {
  if (from === START_LOCATION) return // 첫 접속에서는 옮기지 않음

  nextTick(() => {
    document.querySelector('main h1')?.focus({ preventScroll: true })
  })
})

export default router