// types/favorites.d.ts
export interface FavoriteData {
    updateMs: number;
    syncMs: number;
    version: number;
    ids: string[]
}

export interface FavoriteCloud {
    fileId: string | null;
    updateMs: number;
    version: number;
    ids: string[]
}