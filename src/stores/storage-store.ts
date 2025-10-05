// stores/storage-store.ts
import { defineStore, storeToRefs } from "pinia";
import { debounceFn } from "@/utils/placeholderUtils.ts";
import { uploadFavorites, downloadFavorites, mergeFavorites, type FavoriteData } from "@/utils/syncFavorites";
import { useAuthStore } from "@/stores/auth-store.ts";

interface StorageState {
    favorites: Set<string>;
    favoriteRemoving: Set<string>;
    _debouncedRemove: Map<string, ReturnType<typeof debounceFn>>;
    _debouncedUpload: ReturnType<typeof debounceFn> | null;
    lastSyncAt: number | null;
}

export const useStorageStore = defineStore("storage", {
    state: (): StorageState => ({
        favorites: new Set(),
        favoriteRemoving: new Set(),
        _debouncedRemove: new Map(),
        _debouncedUpload: null,
        lastSyncAt: null,
    }),

    getters: {
        favoritesSet: (state) => new Set([...state.favorites, ...state.favoriteRemoving]),
    },

    actions: {
        async loadFavorites() {
            const data = localStorage.getItem("favorites");
            const localUpdatedAt = Number(localStorage.getItem("favorites_updatedAt")) || Date.now();

            const local: FavoriteData = {
                updatedAt: localUpdatedAt,
                favorites: data ? JSON.parse(data) : [],
            };

            this.favorites = new Set(local.favorites);

            // 尝试云端合并（若没有登录或网络错误则跳过）
            try {
                let authStore = useAuthStore();
                const { isLoggedIn } = storeToRefs(authStore);
                if (!isLoggedIn.value) {
                    return;
                }
                const remote = await downloadFavorites(); // 可能为 null
                const finalData = mergeFavorites(local, remote);
                // 写回本地 & 更新时间戳
                this.favorites = new Set(finalData.favorites);
                localStorage.setItem("favorites", JSON.stringify(finalData.favorites));
                localStorage.setItem("favorites_updatedAt", String(finalData.updatedAt));

                // 上传合并结果（确保云端与本地一致）
                await uploadFavorites(finalData);
                this.lastSyncAt = Date.now();
            } catch (e) {
                console.warn("Drive sync skipped:", e);
            }
        },

        async addFavorite(songId: string) {
            if (!this.favorites.has(songId)) {
                this.favorites.add(songId);
                await this.saveFavorites();
                this.favorites = new Set(this.favorites);

                this.favoriteRemoving.delete(songId);
                this._debouncedRemove.get(songId)?.cancel?.();
                this._debouncedRemove.delete(songId);
            }
        },

        async removeFavorite(songId: string) {
            if (this.favorites.delete(songId)) {
                await this.saveFavorites();
                this.favorites = new Set(this.favorites);

                this.favoriteRemoving.add(songId);
                if (!this._debouncedRemove.has(songId)) {
                    this._debouncedRemove.set(
                        songId,
                        debounceFn(() => {
                            this.favoriteRemoving.delete(songId);
                        }, 8080)
                    );
                }
                this._debouncedRemove.get(songId)!();
            }
        },

        async saveFavorites() {
            localStorage.setItem("favorites", JSON.stringify([...this.favorites]));
            const updatedAt = Date.now();
            localStorage.setItem("favorites_updatedAt", String(updatedAt));

            if (!this._debouncedUpload) {
                this._debouncedUpload = debounceFn(
                    async () => {
                        try {
                            const payload: FavoriteData = { updatedAt, favorites: [...this.favorites] };
                            await uploadFavorites(payload);
                            this.lastSyncAt = Date.now();
                        } catch (e) {
                            console.warn("Upload failed:", e);
                        }
                    },
                    3000
                );
            }

            this._debouncedUpload();
        },
    },
});
