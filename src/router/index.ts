// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to) => {
    document.title = `${ to.meta.title ?? '香鳴ハノン' }チャンネル歌枠検索（非公式）`
})

export default router