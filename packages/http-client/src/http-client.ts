import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { HttpClient, HttpClientConfig, RequestConfig, Response, Interceptor, RetryConfig } from './types'

export class AxiosHttpClient implements HttpClient {
  private instance: AxiosInstance
  private retryConfig: RetryConfig

  constructor(config: HttpClientConfig = {}) {
    this.instance = axios.create({
      timeout: 10000,
      ...config,
    })

    this.retryConfig = {
      retries: 3,
      retryDelay: 1000,
    }

    this.setupDefaultInterceptors()
  }

  private setupDefaultInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: any) => {
        // 기본 헤더 설정
        if (!config.headers) {
          config.headers = {}
        }

        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json'
        }

        return config
      },
      (error: any) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        // 에러 로깅
        console.error('HTTP Client Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
        })

        return Promise.reject(error)
      },
    )
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retryCount: number = 0,
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn()
    } catch (error: any) {
      const shouldRetry = this.retryConfig.retryCondition
        ? this.retryConfig.retryCondition(error)
        : this.isRetryableError(error)

      if (shouldRetry && retryCount < this.retryConfig.retries) {
        await this.delay(this.retryConfig.retryDelay * Math.pow(2, retryCount))
        return this.retryRequest(requestFn, retryCount + 1)
      }

      throw error
    }
  }

  private isRetryableError(error: any): boolean {
    // 네트워크 에러나 5xx 서버 에러는 재시도
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ENOTFOUND'
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private createRequestConfig(config?: RequestConfig): AxiosRequestConfig {
    const { retry, retryDelay, ...axiosConfig } = config || {}

    if (retry !== undefined) {
      this.retryConfig.retries = retry
    }

    if (retryDelay !== undefined) {
      this.retryConfig.retryDelay = retryDelay
    }

    return axiosConfig
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.get<T>(url, axiosConfig))
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.post<T>(url, data, axiosConfig))
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.put<T>(url, data, axiosConfig))
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.patch<T>(url, data, axiosConfig))
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.delete<T>(url, axiosConfig))
  }

  async head<T = any>(url: string, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.head<T>(url, axiosConfig))
  }

  async options<T = any>(url: string, config?: RequestConfig): Promise<Response<T>> {
    const axiosConfig = this.createRequestConfig(config)

    return this.retryRequest(() => this.instance.options<T>(url, axiosConfig))
  }

  // 인터셉터 추가 메서드
  addInterceptor(interceptor: Interceptor): void {
    if (interceptor.request) {
      this.instance.interceptors.request.use(interceptor.request as any)
    }

    if (interceptor.response) {
      this.instance.interceptors.response.use(interceptor.response)
    }

    if (interceptor.error) {
      this.instance.interceptors.response.use((response) => response, interceptor.error)
    }
  }

  // 재시도 설정 업데이트
  setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config }
  }

  // 기본 axios 인스턴스 접근
  getAxiosInstance(): AxiosInstance {
    return this.instance
  }
}
