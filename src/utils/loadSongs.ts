// src/utils/loadSongs.ts
import type {Song} from '@/types/song';
import type {Video} from "@/types/video";

export async function loadVideos(v: string): Promise<Video[]> {
    const modules = import.meta.glob(`@/assets/data/**/*.json`);

    // 过滤出属于该 vtuber 的文件
    return await Promise.all(
        Object.entries(modules)
            .filter(([path]) => path.includes(`/${v}/`)) // 只匹配当前 vtuber
            .map(async ([_, module]) => {
                const data = (await module()) as { default: Video };
                return data.default;
            })
    );
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
                /**
                 * maxresdefault.jpg - 最高分辨率（可能不存在于所有视频）
                 * sddefault.jpg - 标准清晰度
                 * hqdefault.jpg - 高质量
                 * mqdefault.jpg - 中等质量
                 * default.jpg - 默认质量
                 */
                ref_video_thumbnail_url: 'https://img.youtube.com/vi/' + video.video_id + '/hqdefault.jpg',
                ref_video_publish_date_ts: Date.parse(video.video_publish_date_str) / 1000,
                song_origin_artist: songMeta.artist,
                song_title: songMeta.title,
                song_start_time: songMeta.time,
                video_offset_ts: timeToSeconds(songMeta.time)
            };
            if (validSong(song)) {
                songs.push(song);
            } else {
                if (song.song_title.includes('はのは')
                    || song.song_title.includes('スパチャ読み')
                    || song.song_title.includes('エンドカード')
                    || song.song_title.includes('END')
                    || song.song_title.includes('こんばんは')) return;
                console.log("filtered song: %s", song.song_title)
            }

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

function validSong(song: Song): boolean {
    if (!song.song_origin_artist) return false;
    if (song.song_origin_artist.includes('Cパート') && (song.song_title === 'END' || song.song_title === 'ED')) return false;
    if (song.song_title === '雑談') return false;
    return true;
}

function parseSongTimeline(timelineStr: string): any {
    const lines = timelineStr.split('\n').filter(line => line.trim() !== '');
    const songs = [];
    const timeRegex = /^((?:\d+:\d{2}:\d{2})(?:\s*~\s*\d+:\d{2}:\d{2})?)(?:[;；]\s*(?:\d+:\d{2}:\d{2})(?:\s*~\s*\d+:\d{2}:\d{2})?)*\s+(.+)/;

    for (const line of lines) {
        const match = line.match(timeRegex);
        if (!match) continue;
        const time = match[1];
        let songInfo = match[2];

        // Remove numbering
        songInfo = songInfo.replace(/^\d+\.\s*/, '');

        // Split song and artist
        let [title, artist] = songInfo.includes('/')
            ? songInfo.split('/').map(part => part.trim())
            : [songInfo.trim(), ''];

        // Remove duration timestamp and anything after it from artist
        if (artist) {
            artist = artist.replace(/\s*~?\d+:\d{2}:\d{2}.*$/, '').trim();
        }

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