// src/stores/modal-init.ts
import { defineStore } from 'pinia'

export const useModalInitStore = defineStore('modal-init', {
    state: () => ({
        isStatsInit: false,
        isSongMetaListInit: false,
    }),
    actions: {
        triggerStatsInit() {
            this.isStatsInit = true;
        },
        triggerSongInfoInit() {
            this.isSongMetaListInit = true;
        }
    }
})