// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to) => {
    document.title = `${to.meta.title}チャンネル歌枠検索` || '香鳴ハノンチャンネル歌枠検索'
})

export default router