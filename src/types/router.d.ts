// src/types/router.d.ts
import { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        mark?: string
    }
}

export type AppRouteRecordRaw = RouteRecordRaw & {
    meta?: RouteMeta
    children?: AppRouteRecordRaw[]
}