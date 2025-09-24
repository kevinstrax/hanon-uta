// src/types/router.d.ts
import { RouteMeta, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        favicon?: string,
        mark?: string,
        disabled?: boolean
    }
}

export type AppRouteRecordRaw = RouteRecordRaw & {
    meta?: RouteMeta
    children?: AppRouteRecordRaw[]
}