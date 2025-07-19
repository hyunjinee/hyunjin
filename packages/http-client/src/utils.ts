import { AxiosRequestConfig } from 'axios'

/**
 * URL에 쿼리 파라미터를 추가하는 함수
 */
export function addQueryParams(url: string, params: Record<string, any>): string {
  const urlObj = new URL(url, 'http://dummy.com')

  Object.entries(params).forEach(([key, value]: [string, any]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, String(value))
    }
  })

  return urlObj.pathname + urlObj.search
}

/**
 * 헤더에 인증 토큰을 추가하는 함수
 */
export function addAuthHeader(config: AxiosRequestConfig, token: string): AxiosRequestConfig {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * FormData를 생성하는 함수
 */
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]: [string, any]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (value instanceof Blob) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item: any, index: number) => {
        formData.append(`${key}[${index}]`, item)
      })
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}

/**
 * 에러 메시지를 추출하는 함수
 */
export function extractErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.error) {
    return error.response.data.error
  }

  if (error.message) {
    return error.message
  }

  return '알 수 없는 오류가 발생했습니다.'
}

/**
 * HTTP 상태 코드가 성공인지 확인하는 함수
 */
export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300
}

/**
 * HTTP 상태 코드가 클라이언트 에러인지 확인하는 함수
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500
}

/**
 * HTTP 상태 코드가 서버 에러인지 확인하는 함수
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}

/**
 * 요청을 취소할 수 있는 AbortController를 생성하는 함수
 */
export function createAbortController(timeout?: number): AbortController {
  const controller = new AbortController()

  if (timeout) {
    setTimeout(() => {
      controller.abort()
    }, timeout)
  }

  return controller
}

/**
 * URL이 유효한지 확인하는 함수
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 상대 URL을 절대 URL로 변환하는 함수
 */
export function resolveUrl(baseURL: string, relativeURL: string): string {
  try {
    return new URL(relativeURL, baseURL).href
  } catch {
    return relativeURL
  }
}
