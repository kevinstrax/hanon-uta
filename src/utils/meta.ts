import { computed, type ComputedRef, type Ref } from 'vue'
import type { Song } from '@/types/song'

export const generateMeta = (
    favicon: ComputedRef<string> | string,
    pageTitle: ComputedRef<string> | string,
    pageDescription: ComputedRef<string> | string,
    filteredSongs: Ref<Song[]>
) => {
    const titleText = computed(() =>
        typeof pageTitle === 'string' ? pageTitle : pageTitle.value.replace(/（非公式）/, '')
    )

    const descriptionText = computed(() =>
        typeof pageDescription === 'string' ? pageDescription : pageDescription.value?.replace(/非公式ファンサービス/, 'ファン制作応援ツール') ?? ''
    )

    return {
        title: pageTitle,
        link: [
            {
                rel: 'apple-touch-icon',
                href: favicon,
                sizes: '180x180'
            },
            {
                rel: 'icon',
                href: favicon,
                sizes: '32x32',
                type: 'image/png'
            },
            {
                rel: 'icon',
                href: favicon,
                sizes: '16x16',
                type: 'image/png'
            }
        ],
        meta: [
            // Standard meta
            { name: 'description', content: pageDescription },

            // Open Graph
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: computed(() => window.location.href) },
            { property: 'og:title', content: titleText },
            { property: 'og:description', content: descriptionText },
            {
                property: 'og:image',
                content: computed(() => filteredSongs.value[0]?.ref_video_thumbnail_url)
            },

            // Twitter Card
            {
                name: 'twitter:card',
                content: 'summary'
            },
            { name: 'twitter:title', content: titleText },
            { name: 'twitter:description', content: descriptionText },
            {
                name: 'twitter:image',
                content: computed(() => filteredSongs.value[0]?.ref_video_thumbnail_url)
            }
        ]
    }
}