// src/utils/placeholderUtils.ts
import type { Song } from "@/types/song";
import { type Ref } from "vue";

export function extractAndRemove(content: string): { extracted: string[]; cleanedContent: string } {
    // Regular expressions that match the #{=...} pattern
    const pattern = /#\{=([^}]*)}/;
    const match = content.match(pattern);

    if (!match) {
        return { extracted: [], cleanedContent: content };
    }

    // Extract the content after the equal sign and split it
    const extractedContent = match[1];
    const extractedArray = extractedContent.split(',').filter(item => item.trim() !== '');

    // Delete everything that includes #{=}
    const cleanedContent = content.replace(pattern, '').trim();

    return {
        extracted: extractedArray, cleanedContent
    };
}

type AnyFn = (...args: any[]) => void
const timerMap = new WeakMap<AnyFn, number>()

export function debounceFn<T extends AnyFn>(fn: T, delay = 868) {
    const debounced = (...args: Parameters<T>) => {
        // If there is already a timer, clear it
        const existingTimer = timerMap.get(fn)
        if (existingTimer) clearTimeout(existingTimer)

        // Create a new timer
        const timer = window.setTimeout(() => {
            fn(...args)
            timerMap.delete(fn)
        }, delay)

        timerMap.set(fn, timer)
    }

    // Provide a cancel method
    debounced.cancel = () => {
        const existingTimer = timerMap.get(fn)
        if (existingTimer) {
            clearTimeout(existingTimer)
            timerMap.delete(fn)
        }
    }

    return debounced
}

function refocusInput(searchInput: Ref<HTMLInputElement | null>) {
    if (searchInput.value === document.activeElement) {
        searchInput.value?.blur()
        searchInput.value?.focus()
    }
}

function updateSearchPlaceHoldersInner(searchQuery: string, filteredSongs: Song[], placeHolders: Ref<string[]>) {
    const results: string[] = []
    const seen = new Set<string>()
    const query = toHalfWidth(searchQuery.toLowerCase())

    for (const song of filteredSongs) {
        const title = String(song.song_title || '')
        if (toHalfWidth(title).toLowerCase().includes(query) && title !== searchQuery && !seen.has(title)) {
            results.push(title)
            seen.add(title)
            if (results.length >= 10) break
        }
    }
    placeHolders.value = results
}

const updateSearchPlaceHoldersDeb = debounceFn(updateSearchPlaceHoldersInner, 1234)

export function updateSearchPlaceholders(searchQuery: string, filteredSongs: Song[], placeHolders: Ref<string[]>,
                                         searchInput: Ref<HTMLInputElement | null>) {
    if (searchQuery && searchQuery.trim() !== '' && filteredSongs.some(song => toHalfWidth(song.song_title) === toHalfWidth(searchQuery))) {
        resetPlaceHolders(placeHolders, searchInput);
        return;
    }
    if (searchQuery && searchQuery.trim() !== '') {
        updateSearchPlaceHoldersDeb(searchQuery, filteredSongs, placeHolders);
    } else {
        resetPlaceHolders(placeHolders, searchInput);
    }
}

function resetPlaceHolders(placeHolders: Ref<string[]>, searchInput: Ref<HTMLInputElement | null>) {
    updateSearchPlaceHoldersDeb.cancel?.();
    placeHolders.value = []
    refocusInput(searchInput)
}


export function toHalfWidth(str: string): string {
    return str.replace(/[\uFF01-\uFF5E]/g, ch =>
        String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
    ).replace(/\u3000/g, ' '); // Full-width spaces are converted into half-width spaces
}
