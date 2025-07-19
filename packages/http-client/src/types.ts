import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface HttpClientConfig extends AxiosRequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

export interface RequestConfig extends AxiosRequestConfig {
  retry?: number
  retryDelay?: number
}

export interface Response<T = any> extends AxiosResponse<T> {}

export interface HttpClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
  delete<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  head<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  options<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  addInterceptor(interceptor: Interceptor): void
  setRetryConfig(config: Partial<RetryConfig>): void
  getAxiosInstance(): any
}

export interface Interceptor {
  request?: (config: any) => any | Promise<any>
  response?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  error?: (error: any) => any
}

export interface RetryConfig {
  retries: number
  retryDelay: number
  retryCondition?: (error: any) => boolean
}
