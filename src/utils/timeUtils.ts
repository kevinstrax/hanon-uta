
export function parseTs(dateStr: string): number {
    if (!dateStr) return 0;

    // Attempt standard Date parsing
    const parsedDate = new Date(dateStr.replace(/-/g, '/'));

    // Check if the parsed date is invalid (NaN timestamp)
    if (isNaN(parsedDate.getTime())) {
        console.log('Invalid date, %s', dateStr);
        return 0;
    }
    // Return valid timestamp converted to seconds
    return Math.floor(parsedDate.getTime() / 1000);
}

export function timeToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
