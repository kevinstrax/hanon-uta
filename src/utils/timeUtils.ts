/**
 * Robust second-level timestamp parser supporting multiple date formats
 * @param {string} dateStr - Supported formats:
 *    "yyyy-MM-dd HH:mm:ss" (space-separated datetime)
 *    "yyyy-MM-dd" (date only)
 *    ISO 8601 format (with or without timezone)
 * @returns {number} Unix timestamp in seconds (returns 0 for invalid input)
 */
export function parseTs(dateStr: string): number {
    if (!dateStr) return 0;

    // Normalize input to ISO 8601 format with proper timezone handling
    const isoStr = String(dateStr)
        .trim()
        .replace(
            /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}:\d{2}(?:\.\d+)?))?(Z|[+-]\d{2}:?\d{2})?$/,
            (_, date, time, timezone) => {
                let result = date;
                if (time) result += `T${time}`; // Add time component if exists
                result += timezone || 'Z'; // Preserve original timezone or append 'Z' for UTC
                return result;
            }
        );

    // Attempt standard Date parsing
    const parsedDate = new Date(isoStr);

    // Check if the parsed date is invalid (NaN timestamp)
    if (isNaN(parsedDate.getTime())) {
        // Fallback parsing for iOS/Safari compatibility
        const [datePart, timePart] = isoStr.split('T');
        const [year, month, day] = datePart.split('-').map(Number);

        // Extract time components with default zeros
        const [hour = 0, minute = 0, second = 0] = (timePart || '')
            .split(/[:\+Z-]/)
            .map(Number);

        // Generate UTC timestamp directly to avoid timezone issues
        return Math.floor(Date.UTC(year, month - 1, day, hour, minute, second)) / 1000;
    }

    // Return valid timestamp converted to seconds
    return Math.floor(parsedDate.getTime() / 1000);
}

export function timeToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
