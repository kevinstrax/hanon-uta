import { onMounted, ref } from "vue";
import { getGroupedSongMetas, loadSongs } from "@/utils/loadSongs.ts";
import type { Song } from "@/types/song";
import { useLoadingStore } from "@/stores/loading.ts";
import { useFavoriteStore } from "@/stores/favorite-store.ts";
import type { SongMetaGroup } from "@/types/song-meta";
import type { VtuberValues } from "@/config/constants.ts";

export const useSongData = (vtuber: VtuberValues) => {
    const loadingStore = useLoadingStore()
    const favoriteStore = useFavoriteStore();
    const songs = ref<Song[]>([]);
    const songMetaGroups = ref<SongMetaGroup[]>([]);

    onMounted(async () => {
        try {
            loadingStore.startSongsLoading();
            await loadSongs(vtuber)
            favoriteStore.loadFavorites().then(() => {})
            songs.value = await loadSongs(vtuber);
            songMetaGroups.value = getGroupedSongMetas(songs.value);
        } finally {
            loadingStore.completeLoading();
        }
    })

    return {
        songs, songMetaGroups,
    }
}
