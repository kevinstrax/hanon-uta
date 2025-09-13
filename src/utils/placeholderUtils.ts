// src/utils/placeholderUtils.ts
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
        extracted: extractedArray,
        cleanedContent
    };
}