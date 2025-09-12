
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

export function timestampColor(timestamp: number): string {
    const hash = hashString(timestamp + "");
    const colors = [
        '#FF6B8B', '#FF8282', '#E57373',
        '#EF5350', '#F44336', '#E53935',
        '#90CAF9', '#64B5F6', '#42A5F5',
        '#2196F3', '#1E88E5', '#1976D2',
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

function hashString(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
}
