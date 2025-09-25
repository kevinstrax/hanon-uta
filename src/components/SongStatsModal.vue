<script setup lang="ts">
import type { Song } from "@/types/song";
import { storeToRefs } from "pinia";
import { useStatsInitStore } from "@/stores/stats-init.ts";
import { defineAsyncComponent } from "vue";

const SongStats = defineAsyncComponent(() => import("@/components/SongStats.vue"))

const props = defineProps<{ allSongs: Song[], vtuber: string }>();
const { isStatsInit } = storeToRefs(useStatsInitStore())
</script>

<template>
  <div id="exampleModal2" aria-hidden="true" aria-labelledby="exampleModalLabel2" class="modal fade" tabindex="-2">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="exampleModalLabel2" class="modal-title fs-5">{{vtuber}}ちゃん歌唱統計</h1>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <SongStats v-if="isStatsInit" :all-songs="props.allSongs" :vtuber="props.vtuber" />
        </div>
        <!--        <div class="modal-footer">-->
        <!--          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">閉じる</button>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>