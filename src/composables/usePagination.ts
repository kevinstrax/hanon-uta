import { computed, onMounted, ref, type Ref, watch } from "vue";
import type { Song } from "@/types/song";

export const usePagination = (isMobile: Ref<boolean>, filteredSongs: Ref<Song[]>,
                              currentPage: Ref<number>, itemsPerPage: Ref<number>, goToPage: Ref<number>) => {

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


    // mobile pagination
    const loadedSongs = ref<Song[]>([])

    watch([ isMobile, filteredSongs ], () => {
        if (isMobile.value) {
            // The first page is loaded on mobile
            loadedSongs.value = filteredSongs.value.slice(0, itemsPerPage.value)
        }
    })

    const loadMore = () => {
        const nextLength = loadedSongs.value.length + itemsPerPage.value
        loadedSongs.value = filteredSongs.value.slice(0, nextLength)
    }
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

    return {
        changePage, paginatedSongs, totalPages,

        loadedSongs, observerTarget
    }
}