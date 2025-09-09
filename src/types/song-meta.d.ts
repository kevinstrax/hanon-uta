// src/types/song-meta.d.ts
export interface SongMetaGroup {
    group_name: string,
    song_metas: SongMeta[]
}

export interface SongMeta {
    title: string,
    artist: string,
}