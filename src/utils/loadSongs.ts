// src/utils/loadSongs.ts
import type { Song } from '@/types/song';
import type { SongsInfo } from '@/types/songs-info';
import type { Video } from "@/types/video";
import he from 'he'
import { parseTs, timeToSeconds } from './timeUtils'
import { apiRequest } from "@/api/instance.ts";
import type { SongMetaGroup } from "@/types/song-meta";

export function getGroupedSongMetas(songs: Song[]): SongMetaGroup[] {
    // 使用 Map 来去重并保留首个 artist
    const titleMap = new Map<string, string>();

    songs.forEach(song => {
        if (song.song_title && !titleMap.has(song.song_title)) {
            titleMap.set(song.song_title, song.song_origin_artist || '');
        }
    });

    // 定义分组映射
    const groups: { [key: string]: { title: string; artist: string }[] } = {
        '0-9・記号': [],
        'A-Z': [],
        '漢字': [],
        'あ': [],
        'か': [],
        'さ': [],
        'た': [],
        'な': [],
        'は': [],
        'ま': [],
        'や': [],
        'ら': [],
        'わ': []
    };

    const collator = new Intl.Collator('ja');

    // 将歌名分类到对应的组
    titleMap.forEach((artist, title) => {
        if (!title || title.trim() === '') {
            groups['0-9・記号'].push({ title, artist });
            return;
        }

        const firstChar = title.charAt(0);

        // 数字开头
        if (/[0-9]/.test(firstChar)) {
            groups['0-9・記号'].push({ title, artist });
            return;
        }

        // 英文字母开头（A-Z）
        if (/[A-Za-z]/.test(firstChar)) {
            groups['A-Z'].push({ title, artist });
            return;
        }

        // 符号开头
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(firstChar)) {
            groups['0-9・記号'].push({ title, artist });
            return;
        }

        // 汉字开头（中日韩统一表意文字）
        if (/[\u4E00-\u9FFF\u3400-\u4DBF]/.test(firstChar)) {
            groups['漢字'].push({ title, artist });
            return;
        }

        // 日语假名开头（包括ヴ等特殊假名）
        if (/[ぁ-んァ-ヴ]/.test(firstChar)) {
            // 将片假名转换为平假名以便分类
            let hiraganaChar = firstChar;
            if (/[ァ-ヴ]/.test(firstChar)) {
                // 特殊处理ヴ系列
                if (firstChar === 'ヴ') {
                    groups['は'].push({ title, artist });
                    return;
                }
                // 普通片假名转平假名
                hiraganaChar = String.fromCharCode(firstChar.charCodeAt(0) - 0x60);
            }

            // 根据平假名确定分组
            if (/[あいうえおぁぃぅぇぉ]/.test(hiraganaChar)) {
                groups['あ'].push({ title, artist });
            } else if (/[かきくけこがぎぐげご]/.test(hiraganaChar)) {
                groups['か'].push({ title, artist });
            } else if (/[さしすせそざじずぜぞ]/.test(hiraganaChar)) {
                groups['さ'].push({ title, artist });
            } else if (/[たちつてとだぢづでど]/.test(hiraganaChar)) {
                groups['た'].push({ title, artist });
            } else if (/[なにぬねの]/.test(hiraganaChar)) {
                groups['な'].push({ title, artist });
            } else if (/[はひふへほばびぶべぼぱぴぷぺぽ]/.test(hiraganaChar)) {
                groups['は'].push({ title, artist });
            } else if (/[まみむめも]/.test(hiraganaChar)) {
                groups['ま'].push({ title, artist });
            } else if (/[やゆよ]/.test(hiraganaChar)) {
                groups['や'].push({ title, artist });
            } else if (/[らりるれろ]/.test(hiraganaChar)) {
                groups['ら'].push({ title, artist });
            } else if (/[わをん]/.test(hiraganaChar)) {
                groups['わ'].push({ title, artist });
            } else {
                groups['0-9・記号'].push({ title, artist });
            }
            return;
        }

        // 其他情况归入符号组
        groups['0-9・記号'].push({ title, artist });
    });

    // 对每个组内的歌名进行日语排序
    Object.keys(groups).forEach(groupName => {
        groups[groupName].sort((a, b) => collator.compare(a.title, b.title));
    });

    // 转换为数组格式并按组名排序
    const groupOrder = ['0-9・記号', 'A-Z', '漢字', 'あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'ヤ', 'ら', 'わ'];

    return groupOrder
        .filter(groupName => groups[groupName] && groups[groupName].length > 0)
        .map(groupName => ({
            group_name: getDisplayGroupName(groupName),
            song_metas: groups[groupName]
        }));
}

// 获取显示用的组名
function getDisplayGroupName(groupKey: string): string {
    const displayNames: { [key: string]: string } = {
        '0-9・記号': '0-9・記号',
        'A-Z': 'A-Z',
        '漢字': '漢字',
        'あ': 'あ行',
        'か': 'か行',
        'さ': 'さ行',
        'た': 'た行',
        'な': 'な行',
        'は': 'は行',
        'ま': 'ま行',
        'や': 'や行',
        'ら': 'ら行',
        'わ': 'わ行'
    };
    return displayNames[groupKey] || groupKey;
}

export async function loadSongs(v: string): Promise<Song[]> {
    return loadVideos(v).then(parseSong);
}

export async function loadSongsByApi(v: string): Promise<Song[]> {
    return await apiRequest<SongsInfo>({
        url: '/list_songs',
        params: {
            v_tuber: v,
            size: 90000000
        }
    }).then(res => {
        sortByTime(res.song_list)
        return res.song_list
    })
}

async function loadVideos(v: string): Promise<Video[]> {
    const modules = import.meta.glob(`@/assets/data/**/*.json`);

    // Filter out files that belong to the vtuber
    return await Promise.all(
        Object.entries(modules)
            .filter(([path]) => path.includes(`/${v}/`)) // Only the current vtuber is matched
            .map(async ([_, module]) => {
                const data = (await module()) as { default: Video };
                return data.default;
            })
    );
}

// Shared time-based comparison function (descending by date, ascending by offset)
function compareByTime(a: Song, b: Song): number {
    // Primary sort: video publish date (newest first)
    const dateA = Number(a.ref_video_publish_date_ts ?? 0);
    const dateB = Number(b.ref_video_publish_date_ts ?? 0);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    // Secondary sort: video offset timestamp (earlier first)
    const offsetA = Number(a.video_offset_ts ?? 0);
    const offsetB = Number(b.video_offset_ts ?? 0);
    return offsetA - offsetB;
}

/*export function sortByName(songs: Song[]) {
    songs.sort((a, b) => {
        // Primary sort: Japanese song title (50音順)
        const nameCompare = a.song_title.localeCompare(b.song_title, 'ja', {
            sensitivity: 'base',  // Case-insensitive
            numeric: true        // Natural number ordering
        });

        // Fallback to time-based sort when titles match
        return nameCompare !== 0 ? nameCompare : compareByTime(a, b);
    });
}*/

export function sortByTime(songs: Song[]) {
    // Directly use the shared comparison function
    songs.sort(compareByTime);
}

function parseSong(videos: Video[]): Song[] {
    const songs: Song[] = [];

    videos.forEach((video) => {
        parseSongTimeline(video.song_timeline).forEach((songMeta: any) => {
            let offsetSec = timeToSeconds(songMeta.time);
            let song: Song = {
                ref_video_title: video.video_title,
                ref_video_artist: video.video_artist,
                ref_video_url: `https://www.youtube.com/watch?v=${ video.video_id }&t=${ offsetSec }s`,
                ref_video_embed_url: `https://www.youtube.com/embed/${ video.video_id }`,
                /**
                 * maxresdefault.jpg - Highest resolution (may not be present in all videos)
                 * sddefault.jpg - Standard clarity
                 * hqdefault.jpg - Quality
                 * mqdefault.jpg - Medium quality
                 * default.jpg - Default quality
                 */
                ref_video_thumbnail_url: `https://img.youtube.com/vi/${ video.video_id }/sddefault.jpg`,
                ref_video_thumbnail_lqip_url: `https://img.youtube.com/vi/${ video.video_id }/mqdefault.jpg`,
                ref_video_publish_date_ts: parseTs(video.video_publish_date_str),
                song_origin_artist: songMeta.artist,
                song_title: he.decode(songMeta.title),
                song_start_time: songMeta.time,
                video_offset_ts: offsetSec
            };
            if (validSong(song)) {
                songs.push(song);
            } else {
                if (song.song_title.includes('はのは')
                    || song.song_title.includes('スパチャ読み')
                    || song.song_title.includes('エンドカード')
                    || song.song_title.includes('END')
                    || song.song_title.includes('こんばんは')) return;
                // console.log("filtered song: %s", song.song_title)
            }

        });
    });
    // Sorting logic
    sortByTime(songs);
    return songs;
}

function validSong(song: Song): boolean {
    if (!song.song_origin_artist) return false;
    if (song.song_origin_artist.includes('Cパート') && (song.song_title === 'END' || song.song_title === 'ED')) return false;
    if (song.song_title === '雑談') return false;
    return true;
}

const timeRegex = /^((?:\d+:\d{2}:\d{2})(?:\s*~\s*\d+:\d{2}:\d{2})?)(?:[;；]\s*(?:\d+:\d{2}:\d{2})(?:\s*~\s*\d+:\d{2}:\d{2})?)*\s+(.+)/;

function parseSongTimeline(timelineStr: string): any {
    const lines = timelineStr.split('\n').filter(line => line.trim() !== '');
    const songs = [];

    for (const line of lines) {
        const match = timeRegex.exec(line);
        if (!match) continue;
        const time = match[1];
        let songInfo = match[2];

        // Remove numbering
        songInfo = songInfo.replace(/^\d+\.\s*/, '');

        // Split song and artist
        let [ title, artist ] = songInfo.includes('/')
            ? songInfo.split('/').map(part => part.trim())
            : [ songInfo.trim(), '' ];

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
