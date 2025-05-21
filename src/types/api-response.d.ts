// Basic response structure
export interface ApiResponse<T = unknown> {
    success: boolean;
    error_code: number;
    error_message?: string;
    result?: T;
}