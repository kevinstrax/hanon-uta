
const colors = [
    '#FF6B8B', '#FF8282', '#E57373',
    '#EF5350', '#F44336', '#E53935',
    '#90CAF9', '#64B5F6', '#42A5F5',
    '#2196F3', '#1E88E5', '#1976D2',
];

export function timestampColor(timestamp: number): string {
    return nameColor(timestamp + "");
}

export function nameColor(name: string): string {
    // todo idol name mapping to character color
    const hash = hashString(name);
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
