<script setup lang="ts">
import type { SongMetaGroup } from "@/types/song-meta";

const props = defineProps<{
  songMetaGroups: SongMetaGroup[],
}>();

const emit = defineEmits(['update:searchQuery']);
const updateSearchQuery = (title: string) => {
  emit('update:searchQuery', title);
};

</script>

<template>
  <!-- Modal -->
  <section class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">楽曲リスト</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item" v-for="(songMetaGroup, idx) in props.songMetaGroups" >
              <h2 class="accordion-header" :id="'flush-heading' + idx">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#flush-collapse' + idx" aria-expanded="false" :aria-controls="'flush-collapse' + idx">
                  {{songMetaGroup.group_name}}
                </button>
              </h2>
              <div :id="'flush-collapse' + idx" class="accordion-collapse collapse"
                   :aria-labelledby="'flush-heading' + idx" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="songMeta in songMetaGroup.song_metas">
                      <div class="list-group-item-content">
                        <a href="#" @click="updateSearchQuery(songMeta.title)" class="d-block text-body" data-bs-dismiss="modal" >{{songMeta.title}}</a>
                        <i class="small fst-normal text-secondary">{{songMeta.artist}}</i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

.list-group-item:hover {
  background-color: var(--bs-tertiary-bg) !important;
}
.list-group-item-content {
  transition: .3s;
}
.list-group-item:hover .list-group-item-content {
  transform: translateX(6px);
}
.list-group-item-content > a {
  text-decoration: none;
}
.list-group-item-content > a:hover {
  text-decoration: underline;
}
</style>