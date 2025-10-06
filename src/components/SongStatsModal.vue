<script setup lang="ts">
import type { Song } from "@/types/song";
import { storeToRefs } from "pinia";
import { useModalInitStore } from "@/stores/modal-init.ts";
import { defineAsyncComponent } from "vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const SongStats = defineAsyncComponent({
  loader: () => import("@/components/SongStats.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
})

const props = defineProps<{ allSongs: Song[], vtuber: string }>();
const { isStatsInit } = storeToRefs(useModalInitStore())
</script>

<template>
  <div id="exampleModal2" aria-hidden="true" aria-labelledby="exampleModalLabel2" class="modal fade" tabindex="-2">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content h-100">
        <div class="modal-header">
          <h1 id="exampleModalLabel2" class="modal-title fs-5">{{props.vtuber}}ちゃん歌唱統計</h1>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body position-relative">
          <SongStats v-if="isStatsInit" :all-songs="props.allSongs" :vtuber="props.vtuber" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>