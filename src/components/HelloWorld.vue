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
import {
  DEFAULT_PAGE_SIZE,
  SITE_BRAND,
  SITE_DESC,
  SITE_SUFFIX,
  VTUBER_NAME_TO_JA,
  type VtuberValues
} from '@/config/constants';
import SongList from "@/components/SongList.vue";
import QuickSearches from "@/components/QuickSearches.vue";
import SongMetaListModal from "@/components/SongMetaListModal.vue";
import { useColorModeStore } from "@/stores/color-mode.ts";
import UpdateHintToast from "@/components/UpdateHintToast.vue";
import SongStatsModal from "@/components/SongStatsModal.vue";
import { debounceFn, updateSearchPlaceHolders } from "@/utils/placeholderUtils.ts";

const props = defineProps<{ vtuber: VtuberValues }>();
const songs = ref<Song[]>([]);
const songMetaGroups = ref<SongMetaGroup[]>([]);
const loadingStore = useLoadingStore()
const route = useRoute();
const router = useRouter();

const { isDark } = storeToRefs(useColorModeStore())
const { isInitialLoad } = storeToRefs(loadingStore);

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

watch(() => route.query.search,
  (newSearchQuery) => { searchQuery.value = newSearchQuery as string || ''; });

function updateSearchQueryInURL(query: string) {
  router.replace({
    name: route.name,
    query: { search: query || undefined }
  })
}
const updateSearchQueryInURLDeb = debounceFn(updateSearchQueryInURL);
watch(searchQuery, (newSearchQuery) => {
    updateSearchQueryInURLDeb(newSearchQuery);
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
useHead(generateMeta(route.meta.favicon??'favhn.png', pageTitle, pageDescription, filteredSongs))

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
const searchInput = ref<HTMLInputElement | null>(null)
const searchPlaceHolders = ref<string[]>([])

watch([isMobile, filteredSongs, searchQuery], () => {
  if (isMobile.value) {
    // The first page is loaded on mobile
    loadedSongs.value = filteredSongs.value.slice(0, itemsPerPage.value)
  }
  updateSearchPlaceHolders(searchQuery.value, filteredSongs.value, searchInput, searchPlaceHolders);
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
  <!-- search box -->
  <section class="row my-4 mt-0">
    <div class="input-group">
      <label for="searchInput" class="input-group-text bg-light" :class="isDark ? 'bg-dark' : 'bg-light'">
        <i class="iconfont">&#xe7ec;</i>
      </label>
      <input
        id="searchInput"
        ref="searchInput"
        v-model="searchQuery"
        class="form-control shadow-none"
        placeholder="曲名またはアーティスト名で検索..."
        type="search"
        list="nameList"
        :autocomplete="searchPlaceHolders.length > 0 ? 'off' : 'on'"
        autocapitalize="off"
        spellcheck="false"
        @input="currentPage = goToPage = 1"
      >
      <datalist id="nameList" v-if="searchPlaceHolders.length > 0">
        <option v-for="placeHolder in searchPlaceHolders" :value="placeHolder"></option>
      </datalist>
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
    <button
        v-show="showBackTop"
        @click="backToTop"
        class="btn btn-lg border position-fixed end-0 bottom-0 me-4 mb-5 opacity-868"
        :class="isDark ? 'btn-dark' : 'btn-light'">
      <i class="iconfont">&#xe781;</i>
      <span class="visually-hidden">トップに戻る</span>
    </button>

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
  <SongMetaListModal :song-meta-groups="songMetaGroups"
                     v-model:search-query="searchQuery"
  />
  <SongStatsModal v-if="!isInitialLoad"
             :all-songs="songs"
             :vtuber="VTUBER_NAME_TO_JA[props.vtuber]"
  />

</template>

<style scoped>

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