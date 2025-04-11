// src/router/routes.ts
import type { AppRouteRecordRaw } from '@/types/router'

// 定义路由数组
const routes: AppRouteRecordRaw[] = [
    {
        path: '/',
        name: 'Hanon',
        component: () => import('@/components/Hanon.vue'),
        meta: { vtuber: 'hanon', title: '香鳴ハノン' }
    },
    {
        path: '/saotomegabu',
        name: 'Gabu',
        component: () => import('@/components/Gabu.vue'),
        meta: { vtuber: 'gabu', title: '鎖乙女がぶ' }
    },
]

export default routes