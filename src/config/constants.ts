// src/config/constants.ts
export const DEFAULT_PAGE_SIZE: number = 10;

export const SITE_BRAND : string = '香鳴ハノン';
export const SITE_SUFFIX : string = 'ャンネル歌枠検索（非公式）';
export const SITE_DESC : string = 'さんの過去の歌枠から、ライブ配信内の楽曲を瞬時に検索。' +
    '曲名やアーティスト名を入力するだけで、該当箇所にワンクリックで移動できる非公式ツール。';

export const VTUBERS  = {
    KANARU_HANON: {
        name: 'Hanon',
        name_ja: '香鳴ハノン',
        mark: '🎀🎶',
        uri: '/'
    },
    SAOTOME_GABU: {
        name: 'Gabu',
        name_ja: '鎖乙女がぶ',
        mark: '🐺🩰',
        uri: '/saotomegabu'
    },
    AKATSUKI_CLARA: {
        name: 'Clara',
        name_ja: '暁月クララ',
        mark: '🎠💛',
        uri: '/akatsukiclara'
    }
} as const;

type Vtubers = typeof VTUBERS;
export type VtuberKeys = keyof Vtubers; // "KANARU_HANON" | "SAOTOME_GABU" | ...
export type VtuberValues = Vtubers[VtuberKeys]['name']; // "hanon" | "Gabu" | "Clara"

export const VTUBER_KEYS: string[] = Object.entries(VTUBERS).map(([key, _]) => key)
