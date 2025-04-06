// src/utils/loadSongs.ts
import type {Song} from '@/types/song';
import type {Video} from "@/types/video";

export async function loadVideos(): Promise<Video[]> {
    const modules = import.meta.glob('@/assets/data/*.json');
    const videos: Video[] = [];

    for (const path in modules) {
        const module = (await modules[path]()) as { default: Video };
        videos.push(module.default);
    }
    return videos;
}

export async function loadSongs(videos: Video[]): Promise<Song[]> {
    const songs: Song[] = [];

    videos.forEach((video) => {
        parseSongTimeline(video.song_timeline).forEach((songMeta: any) => {
            let song: Song = {
                ref_video_title: video.video_title,
                ref_video_artist: video.video_artist,
                ref_video_url: 'https://www.youtube.com/watch?v=' + video.video_id + '&t=' + timeToSeconds(songMeta.time) + 's',
                ref_video_embed_url: 'https://www.youtube.com/embed/' + video.video_id,
                ref_video_thumbnail_url: 'https://img.youtube.com/vi/' + video.video_id + '/maxresdefault.jpg',
                ref_video_publish_date_ts: Date.parse(video.video_publish_date_str) / 1000,
                song_origin_artist: songMeta.artist,
                song_title: songMeta.title,
                song_start_time: songMeta.time,
                video_offset_ts: timeToSeconds(songMeta.time)
            };
            songs.push(song);
        });
    });
    // 排序逻辑
    songs.sort((a, b) => {
        // 先按 ref_video_publish_date_ts 降序
        if (a.ref_video_publish_date_ts > b.ref_video_publish_date_ts) {
            return -1;
        }
        if (a.ref_video_publish_date_ts < b.ref_video_publish_date_ts) {
            return 1;
        }

        // 如果 ref_video_publish_date_ts 相等，则按 video_offset_ts 升序
        return a.video_offset_ts - b.video_offset_ts;
    });
    return songs;
}

function parseSongTimeline(timelineStr: string): any {
    const lines = timelineStr.split('\n').filter(line => line.trim() !== '');
    const songs = [];
    const timeRegex = /^(\d+:\d{2}:\d{2})\s+(.+)/; // 匹配时间格式

    for (const line of lines) {
        const match = line.match(timeRegex);
        if (!match) continue; // 跳过没有时间戳的行

        const time = match[1];
        let songInfo = match[2];

        // 处理序号（如 "01. 鉄腕アトム" → "鉄腕アトム"）
        songInfo = songInfo.replace(/^\d+\.\s*/, '');

        // 分割歌曲和艺术家
        const [title, artist] = songInfo.includes('/')
            ? songInfo.split('/').map(part => part.trim())
            : [songInfo.trim(), ''];

        songs.push({
            time,
            title,
            artist
        });
    }

    return songs;
}

function timeToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}