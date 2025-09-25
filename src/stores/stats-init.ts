// src/stores/stats-init.ts
import { defineStore } from 'pinia'

export const useStatsInitStore = defineStore('stats-init', {
    state: () => ({
        isStatsInit: false,
    }),
    actions: {
        triggerInit() {
            this.isStatsInit = true;
        }
    }
})