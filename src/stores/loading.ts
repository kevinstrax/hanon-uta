// src/stores/loading.ts
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isInitialLoad: true,
        isSongsLoad: true,
    }),
    actions: {
        completeLoading() {
            this.isInitialLoad = false;
            this.isSongsLoad = false;
        },
        startSongsLoading() {
            this.isInitialLoad = true;
            this.isSongsLoad = true;
        },
    }
})