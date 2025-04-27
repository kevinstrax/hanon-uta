<script setup lang="ts">
import type { Song } from '@/types/song'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadSongs } from '@/utils/loadSongs';
import { generateMeta } from "@/utils/meta";
import { useLoadingStore } from '@/stores/loading'
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head'
import type { VtuberValues } from '@/config/constants';
import { DEFAULT_PAGE_SIZE, SITE_BRAND, SITE_DESC, SITE_SUFFIX } from '@/config/constants';
import SongsList from "@/components/SongsList.vue";
import QuickSearches from "@/components/QuickSearches.vue";

const props = defineProps<{ vtuber: VtuberValues }>();
const songs = ref<Song[]>([]);
const loadingStore = useLoadingStore()
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    loadingStore.startSongsLoading();
    songs.value = await loadSongs(props.vtuber);
  } finally {
    loadingStore.completeLoading();
  }
})

const searchQuery = ref(route.query.search as string || '');
const currentPage = ref(1);
const itemsPerPage = ref(DEFAULT_PAGE_SIZE) // each page displays 10 items
const goToPage = ref(1);

watch(
    () => route.query.search,
    (newSearchQuery) => {
      searchQuery.value = newSearchQuery as string || '';
    }
);
watch(searchQuery, (newSearchQuery) => {
    router.push({
      name: route.name, // Use route names to avoid hardcoding paths
      query: { search: newSearchQuery || undefined }
    });
    if (newSearchQuery && newSearchQuery.trim() !== '') {
      currentPage.value = goToPage.value = 1;
    }
});

// search function
const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs.value;

  const query = searchQuery.value.trim().toLowerCase();
  if (query === '') return songs.value;

  // Score matches based on relevance
  const scoredSongs = songs.value.map(song => {
    const title = song.song_title.toLowerCase();
    const artist = song.song_origin_artist.toLowerCase();

    let score = 0;

    // Exact match gets highest priority
    if (title === query || artist === query) score += 100;

    // Beginning matches score higher
    if (title.startsWith(query)) score += 50;
    if (artist.startsWith(query)) score += 30;

    // Contains matches
    if (title.includes(query)) score += 30;
    if (artist.includes(query)) score += 20;

    // Additional scoring factors could be added here
    // (e.g., word boundary matches, partial matches, etc.)

    return { ...song, _matchScore: score };
  });

  // Filter out non-matches and sort by score (descending)
  const result = scoredSongs
    .filter(song => song._matchScore > 0)
    .sort((a, b) => {
      // First by match score (higher first)
      if (a._matchScore !== b._matchScore) {
        return b._matchScore - a._matchScore;
      }
      // Then fall back to name sorting for equal scores
      return a.song_title.localeCompare(b.song_title, 'ja');
    });

  return result.map(({ _matchScore, ...song }) => song); // Remove temporary score
});

const pageTitle = computed(() => {
  const vtuber = `${ route.meta.title ?? SITE_BRAND }`;
  const baseTitle = `${ vtuber }${ SITE_SUFFIX }`;

  if (searchQuery.value && searchQuery.value.trim() !== '' && filteredSongs.value.length > 0) {
    // Search results page
    return `${ searchQuery.value.trim() }｜${ vtuber }が歌った回を一覧`;
  }
  return baseTitle;
});

const pageDescription = computed(() => {
  const vtuber = `${ route.meta.title ?? SITE_BRAND }`;
  if (searchQuery.value && searchQuery.value.trim() !== '' && filteredSongs.value.length > 0) {
    // Search results page (with song title)
    return `「${ searchQuery.value.trim() }」を${ vtuber }さんが歌った配信回を完全網羅。YouTube該当時間へ直接ジャンプできる非公式ファンサービス。`;
  }
  // Home/Default Page
  return `${ vtuber }${ SITE_DESC }`;
});

// share head
useHead(generateMeta(pageTitle, pageDescription, filteredSongs))

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
  if (currentPage.value === page) {
    return;
  }

  // Boundary checks
  const validatedPage = Math.max(1, Math.min(page, totalPages.value));
  currentPage.value = goToPage.value = validatedPage;
}
const isSmallScreen = ref(false)

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 370
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

</script>

<template>
  <div class="dropdown my-4 d-inline-block">
    <button class="btn btn-light dropdown-toggle" id="dropdownMenuReadme" data-bs-toggle="dropdown" type="button" v-dropdown>
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
          @input="currentPage = goToPage = 1"
      >
    </div>
  </div>

  <!-- a list of songs -->
  <SongsList :paginated-songs="paginatedSongs"/>

  <!-- displays the current page number and total -->
  <div v-if="totalPages > 1"
       class="text-center text-muted small mt-4 mb-2 d-flex justify-content-center align-items-center gap-2">
    <input
        :class="{ disabled: currentPage === 1 }"
        aria-label="前のページ"
        class="btn btn-light rounded-end-0 responsive-width"
        style="min-width: 55px"
        type="button"
        value="&lsaquo;"
        @click.prevent="changePage(currentPage - 1)"/>
    <!-- page jump -->
    <input
        v-model.number="goToPage"
        class="form-control"
        :class="{ 'form-control-sm': isSmallScreen }"
        min="1"
        :max="totalPages"
        :style="{ width: isSmallScreen ? '60px' : '70px' }"
        type="number"
        @keyup.enter="changePage(goToPage)"
    >
    <span class="text-muted text-nowrap" :class="{'small': isSmallScreen}">/ {{ totalPages }}<span class="d-none d-xxs-inline">ページ</span></span>
    <input
        type="button"
        class="btn btn-light"
        @click="changePage(goToPage)"
        value="移動"
    />
    <input
        :class="{ disabled: currentPage === totalPages }"
        aria-label="次のページ"
        class="btn btn-light rounded-start-0 responsive-width"
        style="min-width: 55px"
        type="button"
        value="&rsaquo;"
        @click.prevent="changePage(currentPage + 1)"/>
  </div>

  <p class="text-center mb-4">
    <small>{{ (currentPage - 1) * itemsPerPage + 1 }}～{{ Math.min(currentPage * itemsPerPage, filteredSongs.length) }} 件を表示 / 全 {{ filteredSongs.length }} 件</small>
  </p>

  <QuickSearches />

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
@media (min-width: 365px) {
  .d-xxs-inline {
    display: inline !important;
  }
}
.responsive-width {
  width: 100%; /* Default is 100% */
}

@media (min-width: 576px) { /* sm breakpoint */
  .responsive-width {
    width: auto !important; /* sm and above restore the auto width */
  }
}
</style>