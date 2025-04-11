// src/stores/loading.ts
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isInitialLoad: true
    }),
    actions: {
        completeLoading() {
            this.isInitialLoad = false
        }
    }
})