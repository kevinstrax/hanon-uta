// src/types/song.d.ts
export interface Song {
    ref_video_title: string;
    ref_video_artist: string;
    ref_video_url: string;
    ref_video_embed_url: string;
    ref_video_thumbnail_url: string;
    ref_video_thumbnail_lqip_url: string;
    ref_video_publish_date_ts: number;
    video_offset_ts: number,
    song_title: string,
    song_origin_artist: string,
    song_start_time: string,
    tags: string[],
}