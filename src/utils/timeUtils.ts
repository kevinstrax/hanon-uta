
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

export function checkAndFormatTime(timeStr: string) {
    const seconds = timeToSeconds(timeStr);
    if (isNaN(seconds)) {
        throw Error(`Invalid time string ${timeStr}`);
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        hours.toString(),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0'),
    ].join(':');
}

export function timestampToYear(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    return `${year}`;
}
export function timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


