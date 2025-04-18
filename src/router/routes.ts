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
    }
}))

export default routes