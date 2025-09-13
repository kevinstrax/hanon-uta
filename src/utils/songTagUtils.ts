
const colors = [
    '#FF6B8B', '#FF8282', '#E57373',
    '#EF5350', '#F44336', '#E53935',
    '#90CAF9', '#64B5F6', '#42A5F5',
    '#2196F3', '#1E88E5', '#1976D2',
];
const characterColors =
    {
        '常磐カナメ': '#02BC3F',
        '暁月クララ': '#FA7D09',
        '香鳴ハノン': '#4FC0EC',
        '今羽にこ': '#42A5F5'
    }


export function timestampColor(timestamp: number): string {
    return nameColor(timestamp + "");
}

export function nameColor(name: string): string {
    // todo idol name mapping to character color
    if (name.includes('ハノンちゃん') || name.includes('香鳴ハノン')) {
        return characterColors['香鳴ハノン'];
    }
    if (name.includes('くーちゃん') || name.includes('暁月クララ') || name.includes('クララちゃん')) {
        return characterColors['暁月クララ'];
    }
    if (name.includes('常磐カナメ') || name.includes('カナメちゃん')) {
        return characterColors['常磐カナメ'];
    }
    if (name.includes('今羽にこ')) {
        return characterColors['今羽にこ']
    }
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
