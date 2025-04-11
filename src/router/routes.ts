// src/router/routes.ts
import type { AppRouteRecordRaw } from '@/types/router'

// define an array of routes
const routes: AppRouteRecordRaw[] = [
    {
        path: '/',
        name: 'Hanon',
        component: () => import('@/components/Hanon.vue'),
        meta: { vtuber: 'hanon', title: '香鳴ハノン', mark: '🎀🎶' }
    },
    {
        path: '/saotomegabu',
        name: 'Gabu',
        component: () => import('@/components/Gabu.vue'),
        meta: { vtuber: 'gabu', title: '鎖乙女がぶ', mark: '🐺🩰' }
    },
]

export default routes