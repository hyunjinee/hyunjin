import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AxiosHttpClient } from '../http-client'
import { createHttpClient, createApiClient } from '../factory'
import { addQueryParams, addAuthHeader, extractErrorMessage } from '../utils'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      head: vi.fn(),
      options: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}))

describe('AxiosHttpClient', () => {
  let httpClient: AxiosHttpClient

  beforeEach(() => {
    httpClient = new AxiosHttpClient()
  })

  describe('생성자', () => {
    it('기본 설정으로 인스턴스를 생성해야 한다', () => {
      expect(httpClient).toBeInstanceOf(AxiosHttpClient)
    })

    it('커스텀 설정으로 인스턴스를 생성해야 한다', () => {
      const customClient = new AxiosHttpClient({
        baseURL: 'https://api.example.com',
        timeout: 5000,
      })
      expect(customClient).toBeInstanceOf(AxiosHttpClient)
    })
  })

  describe('HTTP 메서드들', () => {
    it('GET 요청을 수행해야 한다', async () => {
      const mockResponse = { data: { id: 1, name: 'test' } }
      const axiosInstance = httpClient.getAxiosInstance()
      ;(axiosInstance.get as any).mockResolvedValue(mockResponse)

      const result = await httpClient.get('/users/1')
      expect(result).toEqual(mockResponse)
      expect(axiosInstance.get).toHaveBeenCalledWith('/users/1', {})
    })

    it('POST 요청을 수행해야 한다', async () => {
      const mockResponse = { data: { id: 1, name: 'new user' } }
      const axiosInstance = httpClient.getAxiosInstance()
      ;(axiosInstance.post as any).mockResolvedValue(mockResponse)

      const userData = { name: 'new user' }
      const result = await httpClient.post('/users', userData)
      expect(result).toEqual(mockResponse)
      expect(axiosInstance.post).toHaveBeenCalledWith('/users', userData, {})
    })
  })

  describe('재시도 로직', () => {
    it.each([
      { response: { status: 503 } },
      { code: 'ECONNABORTED' },
    ])('POST는 오류 발생 시 기본적으로 재시도하지 않는다: %j', async (error) => {
      httpClient.setRetryConfig({ retries: 5, retryDelay: 0 })
      const instance = httpClient.getAxiosInstance()
      instance.post.mockRejectedValue(error)

      await expect(httpClient.post('/payments', { amount: 100 })).rejects.toBe(error)
      expect(instance.post).toHaveBeenCalledTimes(1)
    })

    it('POST는 요청에 명시한 횟수만큼 재시도하고 GET 설정을 변경하지 않는다', async () => {
      httpClient.setRetryConfig({ retries: 3, retryDelay: 0 })
      const instance = httpClient.getAxiosInstance()
      const error = { response: { status: 503 } }
      instance.post.mockRejectedValue(error)

      await expect(httpClient.post('/payments', {}, { retry: 1, retryDelay: 0 })).rejects.toBe(error)
      expect(instance.post).toHaveBeenCalledTimes(2)
      expect(instance.post).toHaveBeenCalledWith('/payments', {}, {})

      instance.get.mockRejectedValue(error)
      await expect(httpClient.get('/users')).rejects.toBe(error)
      expect(instance.get).toHaveBeenCalledTimes(4)

      instance.post.mockClear()
      await expect(httpClient.post('/payments', {})).rejects.toBe(error)
      expect(instance.post).toHaveBeenCalledTimes(1)
    })

    it('POST의 retry: 0은 재시도를 비활성화한다', async () => {
      const instance = httpClient.getAxiosInstance()
      const error = { response: { status: 503 } }
      instance.post.mockRejectedValue(error)

      await expect(httpClient.post('/payments', {}, { retry: 0 })).rejects.toBe(error)
      expect(instance.post).toHaveBeenCalledTimes(1)
    })

    it('네트워크 에러 시 재시도해야 한다', async () => {
      const mockError = { code: 'ECONNABORTED' }
      const mockResponse = { data: { success: true } }
      const axiosInstance = httpClient.getAxiosInstance()

      ;(axiosInstance.get as any).mockRejectedValueOnce(mockError).mockResolvedValueOnce(mockResponse)

      const result = await httpClient.get('/test')
      expect(result).toEqual(mockResponse)
      expect(axiosInstance.get).toHaveBeenCalledTimes(2)
    })
  })
})

describe('Factory Functions', () => {
  describe('createHttpClient', () => {
    it('HTTP 클라이언트 인스턴스를 생성해야 한다', () => {
      const client = createHttpClient()
      expect(client).toBeInstanceOf(AxiosHttpClient)
    })

    it('커스텀 설정으로 HTTP 클라이언트를 생성해야 한다', () => {
      const client = createHttpClient({
        baseURL: 'https://api.example.com',
        timeout: 5000,
      })
      expect(client).toBeInstanceOf(AxiosHttpClient)
    })
  })

  describe('createApiClient', () => {
    it('API 클라이언트를 생성해야 한다', () => {
      const client = createApiClient('https://api.example.com')
      expect(client).toBeInstanceOf(AxiosHttpClient)
    })
  })
})

describe('Utility Functions', () => {
  describe('addQueryParams', () => {
    it('URL에 쿼리 파라미터를 추가해야 한다', () => {
      const url = '/api/users'
      const params = { page: 1, limit: 10 }
      const result = addQueryParams(url, params)
      expect(result).toBe('/api/users?page=1&limit=10')
    })

    it('undefined나 null 값은 제외해야 한다', () => {
      const url = '/api/users'
      const params = { page: 1, limit: undefined, search: null }
      const result = addQueryParams(url, params)
      expect(result).toBe('/api/users?page=1')
    })
  })

  describe('addAuthHeader', () => {
    it('인증 헤더를 추가해야 한다', () => {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const token = 'test-token'
      const result = addAuthHeader(config, token)

      expect(result.headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      })
    })
  })

  describe('extractErrorMessage', () => {
    it('response.data.message에서 에러 메시지를 추출해야 한다', () => {
      const error = {
        response: {
          data: {
            message: '사용자를 찾을 수 없습니다.',
          },
        },
      }
      const result = extractErrorMessage(error)
      expect(result).toBe('사용자를 찾을 수 없습니다.')
    })

    it('response.data.error에서 에러 메시지를 추출해야 한다', () => {
      const error = {
        response: {
          data: {
            error: '잘못된 요청입니다.',
          },
        },
      }
      const result = extractErrorMessage(error)
      expect(result).toBe('잘못된 요청입니다.')
    })

    it('error.message에서 에러 메시지를 추출해야 한다', () => {
      const error = { message: '네트워크 오류' }
      const result = extractErrorMessage(error)
      expect(result).toBe('네트워크 오류')
    })

    it('기본 에러 메시지를 반환해야 한다', () => {
      const error = {}
      const result = extractErrorMessage(error)
      expect(result).toBe('알 수 없는 오류가 발생했습니다.')
    })
  })
})
