// utils/jsonUtils.ts
export class JsonUtils {

    static fromJson<T = any>(
        text: string | null | undefined,
        reviver?: (this: any, key: string, value: any) => any
    ): T | null {

        if (text === null || text === undefined || text === '') {
            return null;
        }

        try {
            // Remove the before and after spaces, and the empty string returns directly to the default value
            const trimmedText = text.trim();
            if (trimmedText === '') {
                return null;
            }

            // Try parsing JSON
            const result = JSON.parse(trimmedText, reviver);
            return result as T;
        } catch (error) {
            console.error('json parsing failed:', {
                text,
                error: error instanceof Error ? error.message : 'unknown error'
            });
            return null;
        }
    }

    static toJson(obj: any) : string {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            console.error('convert json failed:', {
                obj,
                error: error instanceof Error ? error.message : 'unknown error'
            });
            return '';
        }
    }
}