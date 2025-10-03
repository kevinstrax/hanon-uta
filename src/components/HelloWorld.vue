<script lang="ts" setup>
import { DEFAULT_PAGE_SIZE, VTUBER_NAME_TO_JA, type VtuberValues } from '@/config/constants';
import { storeToRefs } from "pinia";
import { useLoadingStore } from '@/stores/loading.ts'
import { useColorModeStore } from "@/stores/color-mode.ts";
import { useRoute } from 'vue-router';
import { ref } from 'vue'
import SongList from "@/components/SongList.vue";
import QuickSearches from "@/components/QuickSearches.vue";
import SongMetaListModal from "@/components/SongMetaListModal.vue";
import UpdateHintToast from "@/components/UpdateHintToast.vue";
import SongStatsModal from "@/components/SongStatsModal.vue";
import { useSongData } from "@/composables/useSongData.ts";
import { useSongFilter } from "@/composables/useSongFilter.ts";
import { useHeadMeta } from "@/composables/useHeadMeta.ts";
import { usePagination } from "@/composables/usePagination.ts";
import { useScreenSize } from "@/composables/useScreenSize.ts";
import { useBackTop } from "@/composables/useBackTop.ts";
import { usePlaceholder } from "@/composables/usePlaceholder.ts";

const props = defineProps<{ vtuber: VtuberValues }>();

const route = useRoute();
const loadingStore = useLoadingStore()

const { isDark } = storeToRefs(useColorModeStore())
const { isInitialLoad } = storeToRefs(loadingStore);

const searchQuery = ref(route.query.search as string || '');
const filterOption = ref(route.query.filter as string || '');
const filterVideoId = ref(route.query.v as string || '');

const { songs, songMetaGroups } = useSongData(props.vtuber);

const currentPage = ref(1);
const goToPage = ref(1);
const itemsPerPage = ref(DEFAULT_PAGE_SIZE) // each page displays 10 items
const {
  filteredSongs,
  isApplyFavoriteFilter,
  isApplyVideoIdFilter
} = useSongFilter(songs, searchQuery, filterVideoId, filterOption, currentPage, goToPage);

const { searchInput, searchPlaceHolders } = usePlaceholder(searchQuery, filteredSongs);

const { isMobile, isSmallScreen } = useScreenSize();
const {
  // PC
  changePage,
  paginatedSongs,
  totalPages,
  // Mobile
  loadedSongs,
  observerTarget
} = usePagination(isMobile, filteredSongs, currentPage, itemsPerPage, goToPage)

const { showBackTop, backToTop } = useBackTop(isMobile);
useHeadMeta(filteredSongs, searchQuery)

</script>

<template>
  <!-- search box -->
  <section class="row my-4 mt-0">
    <div class="input-group">
      <label :class="isDark ? 'bg-dark' : 'bg-light'" class="input-group-text bg-light" for="searchInput">
        <i class="iconfont">&#xe7ec;</i>
      </label>
      <input
        id="searchInput"
        ref="searchInput"
        v-model="searchQuery"
        :autocomplete="searchPlaceHolders.length > 0 ? 'off' : 'on'"
        autocapitalize="off"
        class="form-control shadow-none"
        list="nameList"
        placeholder="曲名またはアーティスト名で検索..."
        spellcheck="false"
        type="search"
        @input="currentPage = goToPage = 1"
      >
      <datalist v-if="searchPlaceHolders.length > 0" id="nameList">
        <option v-for="placeHolder in searchPlaceHolders" :value="placeHolder"></option>
      </datalist>
    </div>
  </section>

  <div v-if="isApplyFavoriteFilter"
       class="alert alert-light alert-dismissible fade show d-inline-block small py-1 ps-3 pe-2 mb-4 me-2" role="alert">
    ファボリスト
    <button aria-label="Close" class="btn-close small py-2 pe-0 position-relative" data-bs-dismiss="alert" type="button"
            @click="filterOption = ''"></button>
  </div>
  <div v-if="isApplyVideoIdFilter"
       class="alert alert-light alert-dismissible fade show d-inline-block small py-1 ps-3 pe-2 mb-4" role="alert">
    {{ filterVideoId }}
    <button aria-label="Close" class="btn-close small py-2 pe-0 position-relative" data-bs-dismiss="alert" type="button"
            @click="filterVideoId = ''"></button>
  </div>

  <!-- a list of songs -->
  <template v-if="isMobile">
    <SongList v-model:filter-video-id="filterVideoId"
              v-model:search-query="searchQuery"
              :paginated-songs="loadedSongs"/>
    <div ref="observerTarget" class="mb-5">
      <p v-if="loadedSongs.length < filteredSongs.length" class="text-center mb-4">読み込み中...</p>
      <template v-else>
        <p class="text-center mb-4">
          <small>全て読み込みました、全 {{ filteredSongs.length }} 件</small>
        </p>
        <QuickSearches/>
      </template>
    </div>
    <button
      v-show="showBackTop"
      :class="isDark ? 'btn-dark' : 'btn-light'"
      class="btn btn-lg border position-fixed end-0 bottom-0 me-4 mb-5 opacity-868"
      @click="backToTop">
      <i class="iconfont">&#xe781;</i>
      <span class="visually-hidden">トップに戻る</span>
    </button>

  </template>
  <template v-else>
    <SongList v-model:filter-video-id="filterVideoId"
              v-model:search-query="searchQuery"
              :paginated-songs="paginatedSongs"/>
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
        :class="[{ 'form-control-sm': isSmallScreen }, isDark ? 'btn-dark border' : 'btn-light']"
        :max="totalPages"
        :style="{ width: isSmallScreen ? '60px' : '70px' }"
        class="form-control"
        min="1"
        type="number"
        @keyup.enter="changePage(goToPage)"
      >
      <span :class="[{'small': isSmallScreen}]" class="text-muted text-nowrap">/ {{ totalPages }}<span
        class="d-none d-xxs-inline">ページ</span></span>
      <input
        :class="isDark ? 'btn-dark border' : 'btn-light'"
        class="btn"
        type="button"
        value="移動"
        @click="changePage(goToPage)"
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
      <small>{{ (currentPage - 1) * itemsPerPage + 1 }}～{{ Math.min(currentPage * itemsPerPage, filteredSongs.length) }}
        件を表示 / 全 {{ filteredSongs.length }} 件</small>
    </p>

    <QuickSearches/>
  </template>

  <UpdateHintToast/>
  <SongMetaListModal v-model:search-query="searchQuery"
                     :song-meta-groups="songMetaGroups"
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

@media (min-width: 576px) {
  /* sm breakpoint */
  .responsive-width {
    width: auto !important; /* sm and above restore the auto width */
  }
}

</style>