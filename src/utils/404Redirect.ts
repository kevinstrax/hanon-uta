import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VTUBER_URIS } from "@/config/constants";

export function when404Redirect(): boolean {
    const originalUrl: string = window.location.href;
    const uri = new URL(originalUrl)?.pathname.replace(import.meta.env.BASE_URL, '/');
    if (VTUBER_URIS.filter(vUri => vUri === uri).length > 0) {
        window.location.href = `${ import.meta.env.BASE_URL }?from_404=${ encodeURIComponent(originalUrl) }`;
        return false
    }
    return true
}

export function use404Redirect() {
    const router = useRouter()
    const route = useRoute()

    watch(() => route.query.from_404, () => {
        // Check if there is a from_404 parameter
        const from404 = route.query.from_404 as string | undefined
        if (from404) {
            try {
                // Decode the URL
                const decodedUrl = decodeURIComponent(from404)
                const url = new URL(decodedUrl)

                // Extract paths and query parameters
                const path = url.pathname.replace(import.meta.env.BASE_URL, '/')
                const searchParams = new URLSearchParams(url.search)
                const queryParams = Object.fromEntries(searchParams.entries())
                // Check if it's the URL of the current site (avoid open redirects)
                if (url.hostname === window.location.hostname) {
                    // Use replace instead of push to avoid 404 jump records in the history
                    router.replace({
                        path,
                        query: queryParams
                    })
                } else {
                    console.warn('Cross-domain redirects are not allowed:', decodedUrl)
                }
            } catch (error) {
                console.error('Failed to parse from_404 parameters:', error)
            }
        }
    })
}