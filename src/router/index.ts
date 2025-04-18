// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { SITE_BRAND, SITE_SUFFIX } from '../config/constants'
import routes from './routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to) => {
    document.title = `${ to.meta.title ?? SITE_BRAND }${ SITE_SUFFIX }`
})

export default router