import { computed, type ComputedRef, type Ref } from 'vue'
import type { Song } from '@/types/song'

const baseUrl = import.meta.env.BASE_URL;

function getCurrentFavicon(): string | null {
    const el = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!el?.href) return null
    try {
        const url = new URL(el.href)
        return url.pathname
    } catch {
        return el.href
    }
}

function updateFavicon(href: string) {
    let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!iconLink) return;
    iconLink.href = href

    let appleLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    if (!appleLink) return;
    appleLink.href = href
    console.log(appleLink.href)
}

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

    let res : any = {
        title: pageTitle,
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
    const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
    const newFavicon = normalizedBaseUrl + (typeof favicon === 'string' ? favicon : favicon.value)
    if (getCurrentFavicon() !== newFavicon) {
        updateFavicon(newFavicon)
    }
    return res;
}