<script setup lang="ts">
import type { Song } from '@/types/song'
const props = defineProps<{ paginatedSongs: Song[] }>();

</script>

<template>
  <div class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-2">
    <div v-for="(song, index) in props.paginatedSongs" :key="index">
      <div class="card h-100 hover-bg-light ">
        <div class="card-img-top ratio ratio-16x9 ">
          <a :href="song.ref_video_url" class="d-flex align-items-center justify-content-center"
             target="_blank">
            <img
                v-lazy="{
                  src: song.ref_video_thumbnail_url,
                  loading: song.ref_video_thumbnail_lqip_url
                }"
                :alt="song.song_title"
                :title="song.song_title"
                class="img-fluid w-100"
            />
          </a>
        </div>

        <div class="card-body">
          <h6 class="card-title hover-text-light text-truncate d-flex" v-tooltip="song.song_title">
            <i class="iconfont" style="margin-right: 1.5px">&#xe892;</i>
            {{ song.song_title }}</h6>
          <p class="card-text hover-text-light"><small class="text-muted d-block text-truncate"
                                                       v-tooltip="song.song_origin_artist"
          >{{ song.song_origin_artist }}</small></p>
          <p class="card-text hover-text-light">
            <small class="text-muted card-subtitle multi-line-ellipsis-2 " v-tooltip="song.ref_video_title">
              {{ song.ref_video_title }}
            </small>
          </p>
          <p class="card-text hover-text-light">
            <small class="text-muted">
              <a :href="song.ref_video_url"
                 :title="song.song_title"
                 class="text-decoration-none text-secondary d-block"
                 target="_blank">
                <i class="iconfont" style="font-size: 12px">&#xe66e;</i>
                <span style="vertical-align: text-top" class="ms-1">{{ song.song_start_time }}</span></a>
            </small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your existing styles remain the same */
.multi-line-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card {
  padding: 0;
}

.card-img-top a {
  display: block;
  overflow: hidden;
}

.card-img-top {
  position: relative;
  overflow: hidden;
}

.card-img-top::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
  opacity: 0.3;
  pointer-events: none;
}

.hover-bg-light:hover .card-img-top::after {
  opacity: 0.1;
}

.card-img-top img {
  transform: scale(1.01);
  transition: transform 0.3s ease;
}

.hover-bg-light:hover img {
  transform: scale(1.05);
}

.hover-bg-light:hover {
  background-color: var(--bs-tertiary-bg) !important;
}

.hover-bg-light {
  transition: background-color .3s ease;
}

.hover-text-light {
  border-radius: 5px;
  transition: background-color .5s ease;
}

.hover-text-light:hover {
  background-color: var(--bs-secondary-bg) !important;
}
.hover-text-light small a {
  transition: transform 0.3s ease;
}
.hover-text-light small a:hover {
  transform: translateX(6px);
}
</style>