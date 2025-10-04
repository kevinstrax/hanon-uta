<script lang="ts" setup>
import type { Song } from '@/types/song'
import { timestampToDate } from "@/utils/timeUtils.ts";
import { nameColor, timestampColor } from "@/utils/songTagUtils.ts";
import { storeToRefs } from "pinia";
import { useColorModeStore } from "@/stores/color-mode.ts";
import FavoriteIcon from "@/components/FavoriteIcon.vue";

const props = defineProps<{ paginatedSongs: Song[] }>();
const { isDark } = storeToRefs(useColorModeStore())

const emit = defineEmits(['update:filterVideoId', 'update:searchQuery']);
const updateFilterVideoId = (videoId: string) => {
  emit('update:filterVideoId', videoId);
  emit('update:searchQuery', '');
};

</script>

<template>
  <TransitionGroup tag="section" name="fade-only" mode="out-in"
                   class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-2 g-2">
    <article v-for="(song, _) in props.paginatedSongs" :key="song.ref_video_url">
      <div class="card h-100 hover-bg-light">
        <div class="card-img-top ratio ratio-16x9 position-relative">

          <a :href="song.ref_video_url" class="d-flex align-items-center justify-content-center" target="_blank">
            <img v-lazy="{
                  src: song.ref_video_thumbnail_url,
                  loading: song.ref_video_thumbnail_lqip_url
                }" :alt="song.song_title" :title="song.song_title" loading="lazy" class="img-fluid w-100"/>

          </a>

        </div>
        <span v-tooltip="timestampToDate(song.ref_video_publish_date_ts)"
              :style="'background-color: ' + timestampColor(song.ref_video_publish_date_ts)"
              class="d-inline-block position-absolute top-0 end-0 m-1 badge rounded-1 opacity-868 small">
              <small>{{ timestampToDate(song.ref_video_publish_date_ts) }}</small>
            </span>

        <div class="card-body position-relative">
          <!-- Song tags -->
          <div v-if="song.tags.length > 0" class="card-tags position-absolute top-0 start-0 flex-wrap flex-wrap-reverse">
            <template v-for="tag in song.tags">
                <span :style="'background-color: ' + nameColor(tag)"
                      class="badge rounded-1 small m-1 opacity-868">
                    <small>{{ tag }}</small>
                </span>
            </template>
          </div>

          <h2 v-tooltip="song.song_title" class="card-title hover-text-light rounded-1 text-truncate d-flex h6">
            <i class="iconfont icon-music" style="margin-right: 1.5px"></i>
            {{ song.song_title }}
          </h2>
          <p class="card-text hover-text-light rounded-1">
            <small v-tooltip="song.song_origin_artist" class="text-muted d-block text-truncate">
              {{song.song_origin_artist }}
            </small>
          </p>
          <div class="dropdown dropup-center card-text hover-text-light rounded-1 mb-2">
            <button class="btn user-select-text text-wrap text-start p-0 dropdown-toggle drop border-0 no-arrow" data-bs-toggle="dropdown"
                    data-bs-offset="0,10" aria-expanded="false" >
              <!--data-bs-auto-close="outside"-->
              <small class="text-muted card-subtitle multi-line-ellipsis-2">
                {{song.ref_video_title}}
              </small>
            </button>
            <ul class="dropdown-menu p-0">
              <li><h3 class="h6 dropdown-header fw-normal text-wrap p-3"
                      :class="isDark ? 'text-light' : ''">{{song.ref_video_title}}</h3></li>
              <li class="text-end small">
                <a class="d-inline-block text-end m-3 mt-0" href="#" @click="updateFilterVideoId(song.ref_video_id)" role="button">&gt; 配信全曲一覧</a>
              </li>
            </ul>
          </div>
          <p class="card-text hover-text-light rounded-1 d-flex align-items-center justify-content-between">
            <small class="text-muted">
              <a :href="song.ref_video_url" :title="song.song_title" class="text-decoration-none text-secondary d-block"
                 target="_blank">
                <i class="iconfont iconfont-sm icon-bofang"></i>
                <span class="ms-1" style="vertical-align: text-top">{{ song.song_start_time }}</span></a>
            </small>
            <FavoriteIcon :song-id="song.song_id" />
          </p>
        </div>
      </div>
    </article>
  </TransitionGroup>
</template>

<style scoped>
/* Your existing styles remain the same */
.multi-line-ellipsis-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card {
  padding: 0;
}
.card-tags{
  transform: translateY(-100%);
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
  transition: background-color .5s ease;
}

/*.hover-text-light:hover {
  background-color: var(--bs-secondary-bg) !important;
}*/

.hover-text-light small a {
  transition: transform 0.3s ease;
}

.hover-text-light small a:hover {
  transform: translateX(6px);
}


@keyframes titleIconShake {
  0% {
    transform: scale(1);
  }

  70%, 73% {
    transform: scale(0.9) rotate(-3deg);
  }

  77%, 83%, 90%, 97% {
    transform: scale(1.2) rotate(3deg);
  }

  80%, 87%, 93% {
    transform: scale(1.2) rotate(-3deg);
  }

  100% {
    transform: scale(1) rotate(0);
  }
}

.card-title:hover .iconfont {
  animation: titleIconShake 1s ease 1s infinite alternate;
}
.fade-only-enter-active {
  transition: opacity .808s ease;
}
.fade-only-leave-active {
  display: none;
}

.fade-only-enter-from,
.fade-only-leave-to {
  opacity: 0;
}

.fade-only-enter-to,
.fade-only-leave-from {
  opacity: 1;
}
.no-arrow:after {
  display: none !important;
}

</style>