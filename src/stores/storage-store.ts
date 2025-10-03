// stores/storage-store.ts
import { defineStore } from "pinia";
import { debounceFn } from "@/utils/placeholderUtils.ts";

interface StorageState {
    favorites: Set<string>;
    favoriteRemoving: Set<string>;
    _debouncedRemove: Map<string, ReturnType<typeof debounceFn>>,
}

export const useStorageStore = defineStore("storage", {
    state: (): StorageState => ({
        favorites: new Set(),
        favoriteRemoving: new Set(),
        _debouncedRemove: new Map(),
    }),

    getters: {
        favoritesSet: (state) => new Set([...state.favorites, ...state.favoriteRemoving]),
    },

    actions: {
        async loadFavorites() {
            const data = localStorage.getItem("favorites");
            this.favorites = data ? new Set(JSON.parse(data)) : new Set();
        },

        async addFavorite(songId: string) {
            if (!this.favorites.has(songId)) {
                this.favorites.add(songId);
                await this.saveFavorites();
                // Replace the trigger responsive
                this.favorites = new Set(this.favorites);

                this.favoriteRemoving.delete(songId);
                this._debouncedRemove.get(songId)!.cancel();
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
        },
    },
});
