<script setup lang="ts">
import type { Song } from '@/types/song'
import type { SongMetaGroup } from "@/types/song-meta";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getGroupedSongMetas, loadSongs, loadSongsByApi } from '@/utils/loadSongs';
import { generateMeta } from "@/utils/meta";
import { useLoadingStore } from '@/stores/loading'
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head'
import type { VtuberValues } from '@/config/constants';
import { DEFAULT_PAGE_SIZE, SITE_BRAND, SITE_DESC, SITE_SUFFIX } from '@/config/constants';
import SongList from "@/components/SongList.vue";
import QuickSearches from "@/components/QuickSearches.vue";
import SongMetaListModal from "@/components/SongMetaListModal.vue";
import { useColorModeStore } from "@/stores/color-mode.ts";
import UpdateHintToast from "@/components/UpdateHintToast.vue";

const props = defineProps<{ vtuber: VtuberValues }>();
const songs = ref<Song[]>([]);
const songMetaGroups = ref<SongMetaGroup[]>([]);
const loadingStore = useLoadingStore()
const route = useRoute();
const router = useRouter();

const { isDark } = storeToRefs(useColorModeStore())


onMounted(async () => {
  try {
    loadingStore.startSongsLoading();
    if (window.location.host.includes('aquac.cc')) {
      songs.value = await loadSongsByApi(props.vtuber);
    } else {
      songs.value = await loadSongs(props.vtuber);
    }
    songMetaGroups.value = getGroupedSongMetas(songs.value);
  } finally {
    loadingStore.completeLoading();
  }
})

const searchQuery = ref(route.query.search as string || '');
const currentPage = ref(1);
const itemsPerPage = ref(DEFAULT_PAGE_SIZE) // each page displays 10 items
const goToPage = ref(1);
const redPointRead = ref(false)

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

const isMobile = ref(false)
const showBackTop = ref(false)
onBeforeMount(() => {
  isMobile.value = window.innerWidth < 768
})

const loadedSongs = ref<Song[]>([])
watch([isMobile, filteredSongs], () => {
  if (isMobile.value) {
    // The first page is loaded on mobile
    loadedSongs.value = filteredSongs.value.slice(0, itemsPerPage.value)
  }
})

const observerTarget = ref<HTMLElement | null>(null)
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && isMobile.value) {
      loadMore()
    }
  })
  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
})
const loadMore = () => {
  const nextLength = loadedSongs.value.length + itemsPerPage.value
  loadedSongs.value = filteredSongs.value.slice(0, nextLength)
}
function backToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const isSmallScreen = ref(false)
const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 370
}
function handleScroll() {
  showBackTop.value = window.scrollY > 808
}
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  isMobile && window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
  isMobile && window.removeEventListener('scroll', handleScroll)
})

</script>

 <template>

  <nav class="d-flex justify-content-between align-items-center">
    <!-- Button trigger modal -->
    <div class="position-relative">
      <button class="btn" :class="isDark ? 'btn-dark border' : 'btn-light'" data-bs-target="#staticBackdrop" data-bs-toggle="modal" type="button" @click="redPointRead = true">
        <i class="iconfont">&#xe66f;</i> <span class="d-none d-xxs2-inline">楽曲リスト</span>
        <span v-if="!redPointRead" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-1">New</span>
      </button>
    </div>

    <div class="dropdown my-4">
      <button class="btn dropdown-toggle" :class="isDark ? 'btn-dark border' : 'btn-light'" id="dropdownMenuReadme" data-bs-toggle="dropdown" type="button">
        <i class="iconfont me-1">&#xef1f;</i>
        <span class="visually-hidden">説明書</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item" href="https://github.com/kevinstrax/hanon-uta/blob/main/README.md" target="_blank" rel="noopener noreferrer">
            <i class="iconfont me-1">&#xe648;</i>
            日本語
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="https://github.com/kevinstrax/hanon-uta/blob/main/README_zh-CN.md" target="_blank" rel="noopener noreferrer">
            <i class="iconfont me-1">&#xe648;</i>
            简体中文
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- search box -->
  <section class="row my-4 mt-0 clearfix">
    <div class="input-group">
      <label for="searchInput" class="input-group-text bg-light" :class="isDark ? 'bg-dark' : 'bg-light'">
        <i class="iconfont">&#xe7ec;</i>
      </label>
      <input
        id="searchInput"
        v-model="searchQuery"
        class="form-control shadow-none"
        placeholder="曲名またはアーティスト名で検索..."
        type="search"
        @input="currentPage = goToPage = 1"
      >
    </div>
  </section>

  <!-- a list of songs -->
  <template v-if="isMobile">
    <SongList :paginated-songs="loadedSongs"/>
    <div ref="observerTarget" class="mb-5" >
        <p class="text-center mb-4" v-if="loadedSongs.length < filteredSongs.length">読み込み中...</p>
        <template v-else>
          <p class="text-center mb-4">
            <small>全て読み込みました、全 {{ filteredSongs.length }} 件</small>
          </p>
          <QuickSearches />
        </template>
    </div>
    <div class="btn-group-vertical position-fixed end-0 bottom-0 me-4 mb-5 opacity-75" role="group" aria-label="Vertical button group" v-show="showBackTop">
      <label for="searchInput" class="btn btn-lg" :class="isDark ? 'bg-dark' : 'bg-light'">
        <i class="iconfont">&#xe7ec;</i>
      </label>
      <button class="btn btn-lg" :class="isDark ? 'btn-dark border' : 'btn-light'" data-bs-target="#staticBackdrop" data-bs-toggle="modal" type="button" @click="redPointRead = true">
        <i class="iconfont">&#xe66f;</i> <span class="visually-hidden">楽曲リスト</span>
      </button>
      <button
          v-show="showBackTop"
          @click="backToTop"
          class="btn btn-lg"
          :class="isDark ? 'btn-dark border' : 'btn-light'">
        <i class="iconfont">&#xe781;</i>
      </button>
    </div>

  </template>
  <template v-else>
    <SongList :paginated-songs="paginatedSongs"/>
    <!-- displays the current page number and total -->
    <nav v-if="totalPages > 1"
         class="text-center text-muted small mt-4 mb-2 d-flex justify-content-center align-items-center gap-2">
      <input
        :class="[{ disabled: currentPage === 1 }, isDark ? 'btn-dark border' : 'btn-light']"
        :disabled="currentPage === 1"
        aria-label="前のページ"
        class="btn rounded-end-0 responsive-width"
        style="min-width: 55px"
        type="button"
        value="&lsaquo;"
        @click.prevent="changePage(currentPage - 1)"/>
      <!-- page jump -->
      <input
        v-model.number="goToPage"
        class="form-control"
        :class="[{ 'form-control-sm': isSmallScreen }, isDark ? 'btn-dark border' : 'btn-light']"
        min="1"
        :max="totalPages"
        :style="{ width: isSmallScreen ? '60px' : '70px' }"
        type="number"
        @keyup.enter="changePage(goToPage)"
      >
      <span class="text-muted text-nowrap" :class="[{'small': isSmallScreen}]">/ {{ totalPages }}<span class="d-none d-xxs-inline">ページ</span></span>
      <input
        type="button"
        class="btn"
        :class="isDark ? 'btn-dark border' : 'btn-light'"
        @click="changePage(goToPage)"
        value="移動"
      />
      <input
        :class="[{ disabled: currentPage === totalPages }, isDark ? 'btn-dark border' : 'btn-light']"
        :disabled="currentPage === totalPages"
        aria-label="次のページ"
        class="btn rounded-start-0 responsive-width"
        style="min-width: 55px"
        type="button"
        value="&rsaquo;"
        @click.prevent="changePage(currentPage + 1)"/>
    </nav>

    <p class="text-center mb-4">
      <small>{{ (currentPage - 1) * itemsPerPage + 1 }}～{{ Math.min(currentPage * itemsPerPage, filteredSongs.length) }} 件を表示 / 全 {{ filteredSongs.length }} 件</small>
    </p>

    <QuickSearches />
  </template>

  <UpdateHintToast />
  <SongMetaListModal
    :song-meta-groups="songMetaGroups" v-model:search-query="searchQuery"
  />
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
@media (min-width: 400px) {
  .d-xxs2-inline {
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