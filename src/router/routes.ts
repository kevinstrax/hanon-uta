// src/router/routes.ts
import type { AppRouteRecordRaw } from '@/types/router'
import { VTUBERS } from '@/config/constants'

// define an array of routes
const routes: AppRouteRecordRaw[] = Object.entries(VTUBERS).map(([key, vtuber]) => ({
    path: vtuber.uri,
    name: key,
    component: () => import(`@/views/${vtuber.name}.vue`),
    meta: {
        title: vtuber.name_ja,
        mark: vtuber.mark,
        favicon: vtuber.favicon,
    }
}))

// index.html
routes.push({
    path: '/index.html',
    name: 'index',
    component: () => import((`@/views/${ VTUBERS.KANARU_HANON.name }.vue`)),
    meta: {
        title: VTUBERS.KANARU_HANON.name_ja,
        mark: VTUBERS.KANARU_HANON.mark,
        favicon: VTUBERS.KANARU_HANON.favicon,
    }
})

export default routes