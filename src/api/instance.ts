import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from "@/types/api-response";

// Environmental judgment
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
const isTest = import.meta.env.MODE === 'test'

const instance = axios.create({
    baseURL: isProd ? '/hanon-uta/api' : 'http://localhost:18080/hanon-uta/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

/**
 * Request interceptor
 */
instance.interceptors.request.use(
    (config) => {

        const url = config.url
        // Add a request identifier header
        config.headers['X-Requested-With'] = 'XMLHttpRequest'

        // Dev/Test Environment Logs
        if (isDev || isTest) {
            console.groupCollapsed(`%cAPI Request: ${url}`, 'color: #4CAF50; font-weight: bold')
            console.log('Method:', config.method?.toUpperCase())
            console.log('URL:', config.url)
            console.log('Headers:', config.headers)
            console.log('Params:', config.params)
            console.log('Data:', config.data)
            console.groupEnd()
        }

        // This is where you can add an authentication token
        // const token = getToken()
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`
        // }

        return config
    },
    (error) => {
        // Dev/Test Environment Logs
        if (isDev || isTest) {
            console.error('%cAPI Request Error:', 'color: #F44336; font-weight: bold', error)
        }

        return Promise.reject(error)
    }
)

/**
 * Response interceptor
 */
instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
        const url = response?.config?.url
        // Dev/Test Environment Logs
        if (isDev || isTest) {
            console.groupCollapsed(`%API Response: ${url}`, 'color: #2196F3; font-weight: bold')
            console.log('Status:', response.status)
            console.log('Headers:', response.headers)
            console.log('Data:', response.data)
            console.groupEnd()
        }

        // Handles standard response formats
        if (response.data) {
            const { success, error_code, error_message, result } = response.data

            // Successful response
            if (success) {
                return result;
            }

            // Business logic errors
            const error = new Error(error_message || 'Unknown error') as Error & { code?: number }
            error.code = error_code

            if (isDev || isTest) {
                console.error('%API Business Error:', 'color: #FF9800; font-weight: bold', {
                    error_code,
                    error_message,
                    config: response.config,
                    response
                })
            }

            return Promise.reject(error)
        }

        // Non-standard response format
        return response
    },
    (error) => {
        // Dev/Test Environment Logs
        if (isDev || isTest) {
            console.error('%API Response Error:', 'color: #F44336; font-weight: bold', error)
        }

        // Unified error handling
        if (error.response) {
            // There is a response, but the status code is not in the 2xx range
            const { status, data } = error.response
            const errorMessage = data?.message || error.message || `Request failed with status code ${status}`

            const err = new Error(errorMessage) as Error & {
                code?: number
                status?: number
                config?: AxiosRequestConfig
            }

            err.code = data?.code || status
            err.status = status
            err.config = error.config

            return Promise.reject(err)
        } else if (error.request) {
            // The request was sent but no response was received
            const err = new Error('No response received from server') as Error & {
                isNetworkError: boolean
                config?: AxiosRequestConfig
            }
            err.isNetworkError = true
            err.config = error.config
            return Promise.reject(err)
        } else {
            // There was an error with the request settings
            return Promise.reject(error)
        }
    }
)

/**
 * Secure request encapsulation
 * @param config Axios request configuration
 * @returns Response data
 * @throws Business error or network error
 */
export async function apiRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
        const response = await instance.request<ApiResponse<T>>(config)
        return response as unknown as T
    } catch (error) {
        // This is where you can add global error handling, such as displaying an error message
        // if (isDev || isTest) {
        //     showErrorToast(error.message)
        // }

        // The error continues to be thrown and handled by the caller
        throw error
    }
}

