<script setup lang="ts">
import type { Song } from '@/types/song'
import { ref, onMounted, computed } from 'vue'
import { loadSongs } from '@/utils/loadSongs';
import { useLoadingStore } from '@/stores/loading'
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import SongsList from "@/components/SongsList.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";

const props = defineProps<{ vtuber: string }>();
const songs = ref<Song[]>([]);
const loadingStore = useLoadingStore()

onMounted(async () => {
  try {
    loadingStore.startSongsLoading();
    songs.value = await loadSongs(props.vtuber);
  } finally {
    loadingStore.completeLoading();
  }
})

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(DEFAULT_PAGE_SIZE) // each page displays 10 items
const goToPage = ref(1);

// search function
const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs.value
  const query = searchQuery.value.trim().toLowerCase()
  return songs.value.filter(song =>
      song.song_title.toLowerCase().includes(query) ||
      song.song_origin_artist.toLowerCase().includes(query)
  )
})

// paginated data
const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSongs.value.slice(start, end)
})

// total number of pages
const totalPages = computed(() => {
  return Math.ceil(filteredSongs.value.length / itemsPerPage.value)
})

// change the page number
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const paginationList = computed(() => {
  const r = [];
  if (totalPages.value < 7) {
    for (let i = 1; i <= totalPages.value; i++) {
      r.push(i);
    }
    return r;
  }
  if (currentPage.value < 4) {
    return [1, 2, 3, 4, 0, totalPages.value];
  }
  if (currentPage.value < totalPages.value - 3) {
    return [1, 0, currentPage.value - 1, currentPage.value, currentPage.value + 1, 0, totalPages.value];
  }
  return [1, -1, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value];
})

</script>

<template>
  <div class="dropdown my-4 d-inline-block">
    <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
      <i class="fa-solid fa-language fa-fw me-1"></i>
      説明書
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <a class="dropdown-item" href="https://github.com/kevinstrax/hanon-uta/blob/main/README.md" target="_blank" rel="noopener noreferrer">
          <i class="fa-solid fa-file-lines fa-fw me-2"></i> 日本語
        </a>
      </li>
      <li>
        <a class="dropdown-item" href="https://github.com/kevinstrax/hanon-uta/blob/main/README_zh-CN.md" target="_blank" rel="noopener noreferrer">
          <i class="fa-solid fa-file-lines fa-fw me-2"></i> 简体中文
        </a>
      </li>
    </ul>
  </div>
  <!-- search box -->
  <div class="row my-4 mt-0 clearfix">
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

  <!-- a list of songs -->
  <SkeletonLoader v-if="loadingStore.isSongsLoad" />
  <SongsList v-else :paginated-songs="paginatedSongs"/>

  <!-- Pagination controls -->
  <nav aria-label="ページネーション" class="mt-4" v-if="totalPages > 1">
    <ul class="pagination justify-content-center flex-wrap">

      <li class="page-item" :class="{ disabled: currentPage === 1 }" v-if="currentPage > 1">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="前のページ">
          &lsaquo;
        </a>
      </li>

      <li v-for="i in paginationList" class="page-item" :class="{ active: currentPage === i, disabled: i <=0 }">
        <template v-if="i <= 0">
          <span class="page-link">...</span>
        </template>
        <template v-else>
          <a class="page-link" href="#" @click.prevent="changePage(i)">{{i}}</a>
        </template>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }" v-if="currentPage < totalPages">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="次のページ">
          &rsaquo;
        </a>
      </li>
    </ul>
  </nav>

  <!-- displays the current page number and total -->
  <div class="text-center text-muted small mt-2 mb-4" v-if="filteredSongs.length > 0">
    {{ (currentPage - 1) * itemsPerPage + 1 }}～{{ Math.min(currentPage * itemsPerPage, filteredSongs.length) }} 件を表示 / 全 {{ filteredSongs.length }} 件
    <!-- page jump -->
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

.card-img-top a {
  display: block;
  overflow: hidden;
}

.card-img-top img {
  transform: scale(1.01);
  transition: transform 0.3s ease;
}

.hover-bg-light:hover img {
  transform: scale(1.05);
}

</style>