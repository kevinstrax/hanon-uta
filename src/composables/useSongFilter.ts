import { debounceFn, toHalfWidth } from "@/utils/placeholderUtils.ts";
import { computed, type Ref, watch } from 'vue';
import type { Song } from "@/types/song";
import { useFavoriteStore } from "@/stores/favorite-store.ts";
import { useRoute, useRouter } from "vue-router";
import { updateQueryParam, updateQueryParams } from "@/utils/routerUtils.ts";

export const useSongFilter = (songs: Ref<Song[]>, searchQuery: Ref<string>, filterVideoId: Ref<string>, filterOption: Ref<string>,
                              currentPage: Ref<number>, goToPage: Ref<number>) => {

    const router = useRouter();
    const route = useRoute();

    watch(
        () => ({
            search: route.query.search as string || '',
            v: route.query.v as string || '',
            filter: route.query.filter as string || '',
        }),
        (newVals) => {
            if (searchQuery.value !== newVals.search) {
                searchQuery.value = newVals.search;
            }
            if (filterVideoId.value !== newVals.v) {
                filterVideoId.value = newVals.v;
            }
            if (filterOption.value !== newVals.filter) {
                filterOption.value = newVals.filter;
            }
        },
        { immediate: true }
    );

    function updateSearchQueryInURL(query: string) {
        updateQueryParam(router, route, 'search', query);
    }

    const updateSearchQueryInURLDeb = debounceFn(updateSearchQueryInURL);

    watch(
        () => ({
            search: searchQuery.value,
            v: filterVideoId.value,
            filter: filterOption.value,
        }),
        (newVals, oldVals) => {
            const paramsToUpdate: Record<string, string | undefined> = {};

            const changedKeys = Object.keys(newVals).filter(
                key => newVals[key as keyof typeof newVals] !== oldVals?.[key as keyof typeof oldVals]
            );

            // Deal with it on a case-by-case basis
            if (changedKeys.length === 1 && changedKeys[0] === 'search') {
                // Only searchQuery changes, using debounceFn
                updateSearchQueryInURLDeb(newVals.search);
            } else if (changedKeys.length > 0) {
                // Multiple variations or non-searchQuery, update the URL directly
                changedKeys.forEach(key => {
                    const val = newVals[key as keyof typeof newVals];
                    paramsToUpdate[key] = val;
                });
                if (changedKeys.includes('search')) {
                    updateSearchQueryInURLDeb.cancel?.();
                }
                updateQueryParams(router, route, paramsToUpdate);
            }
            currentPage.value = goToPage.value = 1;
        },
        { immediate: true }
    );

    const favoriteStore = useFavoriteStore();

    function filterSongByOptions(songs: Song[]) {
        return songs.filter(song => {
            if (applyVideoIdFilter()) {
                return filterVideoId.value === song.ref_video_id;
            }
            return true;
        }).filter(song => {
            if (applyFavoriteFilter()) {
                return favoriteStore.favoritesSet.has(song.song_id)
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



