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
            timerMap.delete(fn) // 执行完删除
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

function updateSearchPlaceHoldersInner(searchQuery: string, filteredSongs: Song[], placeHolders: Ref<string[]>, searchInput: Ref<HTMLInputElement | null>) {
    if (searchQuery && searchQuery.trim() !== '') {
        const results: string[] = []
        const seen = new Set<string>()
        const query = searchQuery.toLowerCase()

        for (const song of filteredSongs) {
            const title = String(song.song_title || '')
            if (title.toLowerCase().includes(query) && title !== searchQuery && !seen.has(title)) {
                results.push(title)
                seen.add(title)
                if (results.length >= 10) break
            }
        }
        placeHolders.value = results
    } else {
        placeHolders.value = []
        refocusInput(searchInput);
    }
}

const updateSearchPlaceHoldersDeb = debounceFn(updateSearchPlaceHoldersInner, 1234)
export function updateSearchPlaceHolders(searchQuery: string, filteredSongs: Song[], searchInput: Ref<HTMLInputElement | null>, placeHolders: Ref<string[]>) {
    if (searchQuery && searchQuery.trim() !== '' && filteredSongs.some(song => song.song_title === searchQuery)) {
        updateSearchPlaceHoldersDeb.cancel?.();
        placeHolders.value = []
        refocusInput(searchInput)
        return;
    }
    updateSearchPlaceHoldersDeb(searchQuery, filteredSongs, placeHolders, searchInput);
}


