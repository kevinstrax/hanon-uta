<script setup lang="ts">
import {ref, computed } from 'vue'
import type {Song} from '@/types/song'

const props = defineProps<{
  songs: Song[]
}>()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10) // 每页显示10个项目

// 搜索功能
const filteredSongs = computed(() => {
  if (!searchQuery.value) return props.songs
  const query = searchQuery.value.toLowerCase()
  return props.songs.filter(song =>
      song.song_title.toLowerCase().includes(query) ||
      song.song_origin_artist.toLowerCase().includes(query)
  )
})

// 分页数据
const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSongs.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredSongs.value.length / itemsPerPage.value)
})

// 改变页码
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
const getPageRange = computed(() => {
  const range = [];
  const start = Math.max(2, currentPage.value - 2);
  const end = Math.min(totalPages.value - 1, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

const goToPage = ref(1);

</script>

<template>
  <!-- 搜索框 -->
  <div class="row mb-4">
    <div class="input-group">
      <span class="input-group-text bg-light">
        <i class="fas fa-search"></i>
      </span>
      <input
          v-model="searchQuery"
          type="search"
          class="form-control shadow-none"
          placeholder="曲名またはアーティスト名で検索..."
          @input="currentPage = 1"
      >
    </div>
  </div>

  <!-- 歌曲列表 -->
  <div class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-2">
    <div v-for="(song, index) in paginatedSongs" :key="index">
      <div class="card h-100 hover-bg-light">
        <div class="card-img-top">
          <a :href="song.ref_video_url"
             target="_blank"><img class="img-fluid" :src="song.ref_video_thumbnail_url" :alt="song.song_title"
                                  :title="song.song_title"/></a>
        </div>

        <div class="card-body text-start">
          <h6 class="card-title hover-text-light text-truncate" :title="song.song_title">
            <i class="fas fa-music"></i>
            {{ song.song_title }}</h6>
          <p class="card-text hover-text-light"><small class="text-muted d-block text-truncate"
                                                       :title="song.song_origin_artist"
          >{{ song.song_origin_artist }}</small></p>
          <p class="card-text hover-text-light">
            <small class="text-muted card-subtitle multi-line-ellipsis-2 " :title="song.ref_video_title">
              {{ song.ref_video_title }}
            </small>
          </p>
          <p class="card-text hover-text-light"><small class="text-muted">
            <a class="text-decoration-none text-secondary" :href="song.ref_video_url"
               :title="song.song_title"
               target="_blank">{{ song.song_start_time }}</a>
          </small>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- 分页控件 -->
  <nav aria-label="ページネーション" class="mt-4" v-if="totalPages > 1">
    <ul class="pagination justify-content-center flex-wrap">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(1)" aria-label="最初のページ">
          &laquo;
        </a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="前のページ">
          &lsaquo;
        </a>
      </li>

      <!-- 总是显示第1页 -->
      <li class="page-item" :class="{ active: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(1)">1</a>
      </li>

      <!-- 当前页附近范围 -->
      <li class="page-item disabled" v-if="currentPage > 4">
        <span class="page-link">...</span>
      </li>

      <template v-for="page in getPageRange" :key="page">
        <li class="page-item" v-if="page > 1 && page < totalPages" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
      </template>

      <li class="page-item disabled" v-if="currentPage < totalPages - 3">
        <span class="page-link">...</span>
      </li>

      <!-- 总是显示最后一页 -->
      <li class="page-item" v-if="totalPages > 1" :class="{ active: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="次のページ">
          &rsaquo;
        </a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(totalPages)" aria-label="最後のページ">
          &raquo;
        </a>
      </li>
    </ul>
  </nav>

  <!-- 显示当前页码和总数 -->
  <div class="text-center text-muted small mt-2" v-if="filteredSongs.length > 0">
    {{ (currentPage - 1) * itemsPerPage + 1 }}～{{ Math.min(currentPage * itemsPerPage, filteredSongs.length) }} 件を表示 / 全 {{ filteredSongs.length }} 件
    <!-- 页面跳转 -->
    <div class="d-flex justify-content-center align-items-center gap-2 mt-2" v-if="totalPages > 1">
      <input
          type="number"
          v-model.number="goToPage"
          min="1"
          :max="totalPages"
          class="form-control form-control-sm"
          style="width: 60px;"
          @keyup.enter="changePage(goToPage)"
      >
      <span class="small text-muted">/ {{ totalPages }}ページ</span>
      <button
          class="btn btn-sm btn-outline-primary"
          @click="changePage(goToPage)"
      >
        移動
      </button>
    </div>
  </div>

</template>

<style scoped>
/* 你的现有样式保持不变 */
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

/* 分页样式增强 */
.page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.page-link {
  color: var(--bs-primary);
}

.page-link:hover {
  background-color: var(--bs-light);
}
/* 小屏幕下隐藏部分页码 */
/*@media (max-width: 576px) {
  .page-item .page-link {
    padding: 0.25rem 0.5rem;
  }
  .page-item:not(.active):not(:first-child):not(:last-child):not(.disabled) {
    display: none;
  }
}*/
</style>