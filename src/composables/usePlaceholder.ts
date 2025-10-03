import { ref, type Ref, watch } from "vue";
import { updateSearchPlaceholders } from "@/utils/placeholderUtils.ts";
import type { Song } from "@/types/song";

export const usePlaceholder = (searchQuery: Ref<string>, filteredSongs: Ref<Song[]>) => {

    const searchInput = ref<HTMLInputElement | null>(null)
    const searchPlaceHolders = ref<string[]>([])
    watch([ filteredSongs, searchQuery ], () => {
        updateSearchPlaceholders(searchQuery.value, filteredSongs.value, searchPlaceHolders, searchInput);
    })
    // Placeholder
    return {
        searchInput, searchPlaceHolders,
    }
}