// src/types/router.d.ts
import { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        vtuber: string
        // 其他自定义元字段
    }
}

export type AppRouteRecordRaw = RouteRecordRaw & {
    meta?: RouteMeta
    children?: AppRouteRecordRaw[]
}