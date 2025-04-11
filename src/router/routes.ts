// src/router/routes.ts
import type { AppRouteRecordRaw } from '@/types/router'

// define an array of routes
const routes: AppRouteRecordRaw[] = [
    {
        path: '/',
        name: 'Hanon',
        component: () => import('@/components/Hanon.vue'),
        meta: { title: '香鳴ハノン', mark: '🎀🎶' }
    },
    {
        path: '/saotomegabu',
        name: 'Gabu',
        component: () => import('@/components/Gabu.vue'),
        meta: { title: '鎖乙女がぶ', mark: '🐺🩰' }
    },
]

export default routes