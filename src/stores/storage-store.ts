// stores/storage-store.ts
import { defineStore, storeToRefs } from "pinia";
import { debounceFn } from "@/utils/placeholderUtils.ts";
import { uploadFavorites, downloadFavorites, FavoriteSync } from "@/utils/syncFavorites";
import { useAuthStore } from "@/stores/auth-store.ts";
import { JsonUtils } from "@/utils/jsonUtils.ts";
import type { FavoriteData } from "@/types/favorite";

interface StorageState {
    favorites: Set<string>;
    favoriteRemoving: Set<string>;
    _debouncedRemove: Map<string, ReturnType<typeof debounceFn>>;
    _debouncedUpload: ReturnType<typeof debounceFn> | null;
    lastSyncAt: number | null;
}

function initOrGetFavoriteLocal() : FavoriteData {
    let local = JsonUtils.fromJson<FavoriteData>(localStorage.getItem("favorites"));
    return {
        syncMs: local?.syncMs ?? 0,
        updateMs: local?.updateMs ?? 0,
        version: local?.version ?? 0,
        ids: local?.ids??[],
    }
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
            const local = initOrGetFavoriteLocal();
            this.favorites = new Set([...local.ids]);
            await this.trySync(local);
        },

        async addFavorite(songId: string) {
            if (!this.favorites.has(songId)) {
                this.favorites.add(songId);
                this.favorites = new Set(this.favorites);

                this.favoriteRemoving.delete(songId);
                this._debouncedRemove.get(songId)?.cancel?.();
                this._debouncedRemove.delete(songId);
                await this.saveFavorites();
            }
        },

        async removeFavorite(songId: string) {
            if (this.favorites.delete(songId)) {
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
                await this.saveFavorites();
            }
        },

        async saveFavorites() {
            const local = initOrGetFavoriteLocal();
            local.ids = Array.from(this.favorites);
            local.updateMs = Date.now();
            this._debouncedUpload?.cancel?.();
            this._debouncedUpload = debounceFn(() => this.trySync(local), 3000);
            this._debouncedUpload();
        },
        async trySync(local : FavoriteData) {
            try {
                // 同步前先保存一次
                localStorage.setItem("favorites", JsonUtils.toJson(local));

                // 尝试云端合并（若没有登录或网络错误则跳过）
                let authStore = useAuthStore();
                const { isLoggedIn } = storeToRefs(authStore);
                if (!isLoggedIn.value) {
                    return;
                }
                const remote = await downloadFavorites();

                // 执行同步
                const syncResult = FavoriteSync.sync(local, remote);
                if (syncResult.needUpdateCloud) {
                    await uploadFavorites(syncResult.cloud).then(() => {
                        localStorage.setItem("favorites", JsonUtils.toJson(syncResult.local));
                        this.favorites = new Set(syncResult.local.ids);
                    })
                } else {
                    localStorage.setItem("favorites", JsonUtils.toJson(syncResult.local));
                    this.favorites = new Set(syncResult.local.ids);
                }
            } catch (e) {
                console.warn("Drive sync skipped:", e);
            }
        }
    },
});
