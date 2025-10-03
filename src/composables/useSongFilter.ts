import { debounceFn, toHalfWidth } from "@/utils/placeholderUtils.ts";
import { computed, type Ref, watch } from 'vue';
import type { Song } from "@/types/song";
import { useStorageStore } from "@/stores/storage-store.ts";
import { useRoute, useRouter } from "vue-router";

export const useSongFilter = (songs: Ref<Song[]>, searchQuery: Ref<string>, filterVideoId: Ref<string>, filterOption: Ref<string>,
                              currentPage: Ref<number>, goToPage: Ref<number>) => {

    const router = useRouter();
    const route = useRoute();

    watch(() => route.query.search, (newSearchQuery) => {
        searchQuery.value = newSearchQuery as string || '';
    });
    watch(() => route.query.v, (newFilterVideoId) => {
        filterVideoId.value = newFilterVideoId as string || '';
    });
    watch(() => route.query.filter, (newFilterOption) => {
        filterOption.value = newFilterOption as string || '';
    })

    function updateQueryParam(key: string, value: string | undefined) {
        router.replace({
            name: route.name, query: {
                ...route.query, [key]: value || undefined
            }
        });
    }

    function updateSearchQueryInURL(query: string) {
        updateQueryParam('search', query);
    }

    const updateSearchQueryInURLDeb = debounceFn(updateSearchQueryInURL);
    watch(searchQuery, (newSearchQuery) => {
        updateSearchQueryInURLDeb(newSearchQuery);
        if (newSearchQuery && newSearchQuery.trim() !== '') {
            currentPage.value = goToPage.value = 1;
        }
    });
    watch(filterVideoId, (newFilterVideoId) => {
        updateQueryParam('v', newFilterVideoId);
        if (newFilterVideoId && newFilterVideoId.trim() !== '') {
            currentPage.value = goToPage.value = 1;
        }
    })
    watch(filterOption, (newFilterOption) => {
        updateQueryParam('filter', newFilterOption);
        if (newFilterOption && newFilterOption.trim() !== '') {
            currentPage.value = goToPage.value = 1;
        }
    })

    const storage = useStorageStore();

    function filterSongByOptions(songs: Song[]) {
        return songs.filter(song => {
            if (applyVideoIdFilter()) {
                return filterVideoId.value === song.ref_video_id;
            }
            return true;
        }).filter(song => {
            if (applyFavoriteFilter()) {
                return storage.favoritesSet.has(song.song_id)
            }
            return true;
        })
    }

    function applyFavoriteFilter() {
        return filterOption.value && filterOption.value.toLowerCase() === 'favorite';
    }

    function applyVideoIdFilter() {
        return filterVideoId.value && filterVideoId.value !== '';
    }

    const isApplyFavoriteFilter = computed(() => {
        return applyFavoriteFilter();
    })
    const isApplyVideoIdFilter = computed(() => {
        return applyVideoIdFilter();
    })

    // search function
    const filteredSongs = computed(() => {
        if (!searchQuery.value) return filterSongByOptions(songs.value);

        const query = toHalfWidth(searchQuery.value.trim().toLowerCase());
        if (query === '') return filterSongByOptions(songs.value);

        // Score matches based on relevance
        const scoredSongs = songs.value.map(song => {
            const title = toHalfWidth(song.song_title.toLowerCase());
            const artist = toHalfWidth(song.song_origin_artist.toLowerCase());

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

        return filterSongByOptions(result.map(({ _matchScore, ...song }) => song)); // Remove temporary score
    });

    return {
        filteredSongs, isApplyFavoriteFilter, isApplyVideoIdFilter
    }
}



