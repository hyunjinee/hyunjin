import { AxiosHttpClient } from './http-client'
import { HttpClient, HttpClientConfig } from './types'

/**
 * HTTP 클라이언트 인스턴스를 생성하는 팩토리 함수
 */
export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new AxiosHttpClient(config)
}

/**
 * 기본 설정으로 HTTP 클라이언트를 생성하는 함수
 */
export function createDefaultHttpClient(): HttpClient {
  return createHttpClient({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * API 서버용 HTTP 클라이언트를 생성하는 함수
 */
export function createApiClient(baseURL: string, config?: Omit<HttpClientConfig, 'baseURL'>): HttpClient {
  return createHttpClient({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })
}

/**
 * 파일 업로드용 HTTP 클라이언트를 생성하는 함수
 */
export function createUploadClient(baseURL?: string): HttpClient {
  return createHttpClient({
    baseURL,
    timeout: 60000, // 파일 업로드는 더 긴 타임아웃
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
