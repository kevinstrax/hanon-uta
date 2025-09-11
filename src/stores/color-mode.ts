// stores/colorMode.ts
import { defineStore } from "pinia"
import { ref } from "vue"

export const useColorModeStore = defineStore("colorMode", () => {
    const isDark = ref(false)
    let media: MediaQueryList | null = null

    function applyTheme(dark: boolean) {
        document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light")
        isDark.value = dark
    }

    function updateTheme(e: MediaQueryListEvent) {
        applyTheme(e.matches)
    }

    function init() {
        if (media) return // Avoid duplicate bindings
        media = window.matchMedia("(prefers-color-scheme: dark)")
        applyTheme(media.matches)
        media.addEventListener("change", updateTheme)
    }

    function destroy() {
        if (media) {
            media.removeEventListener("change", updateTheme)
            media = null
        }
    }

    return { isDark, init, destroy }
})
