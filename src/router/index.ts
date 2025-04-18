// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import { SITE_BRAND, SITE_SUFFIX } from '../config/constants'
import routes from './routes'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to) => {
    document.title = `${ to.meta.title ?? SITE_BRAND }${ SITE_SUFFIX }`
})

export default router