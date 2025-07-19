# @hyunjin/http-client

Axios 기반 HTTP 클라이언트 패키지입니다. 재시도 로직, 인터셉터, 유틸리티 함수 등을 포함한 강력한 HTTP 클라이언트를 제공합니다.

## 설치

```bash
pnpm add @hyunjin/http-client axios
```

## 기본 사용법

### 1. 기본 HTTP 클라이언트 사용

```typescript
import { httpClient } from '@hyunjin/http-client'

// GET 요청
const response = await httpClient.get('/api/users')
console.log(response.data)

// POST 요청
const newUser = await httpClient.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
})
```

### 2. 커스텀 설정으로 클라이언트 생성

```typescript
import { createHttpClient } from '@hyunjin/http-client'

const client = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    Authorization: 'Bearer your-token',
  },
})

const users = await client.get('/users')
```

### 3. API 서버용 클라이언트 생성

```typescript
import { createApiClient } from '@hyunjin/http-client'

const apiClient = createApiClient('https://api.example.com', {
  timeout: 15000,
})

// 자동으로 baseURL이 적용됩니다
const user = await apiClient.get('/users/1')
```

### 4. 파일 업로드용 클라이언트

```typescript
import { createUploadClient } from '@hyunjin/http-client'

const uploadClient = createUploadClient('https://upload.example.com')

const formData = new FormData()
formData.append('file', fileInput.files[0])

const result = await uploadClient.post('/upload', formData)
```

## 고급 기능

### 재시도 설정

```typescript
import { AxiosHttpClient } from '@hyunjin/http-client'

const client = new AxiosHttpClient()

// 재시도 설정 업데이트
client.setRetryConfig({
  retries: 5,
  retryDelay: 2000,
  retryCondition: (error) => {
    // 커스텀 재시도 조건
    return error.response?.status === 429
  },
})
```

### 인터셉터 추가

```typescript
import { AxiosHttpClient } from '@hyunjin/http-client'

const client = new AxiosHttpClient()

// 요청 인터셉터
client.addInterceptor({
  request: (config) => {
    // 요청 전 처리
    console.log('Request:', config.url)
    return config
  },
  response: (response) => {
    // 응답 후 처리
    console.log('Response:', response.status)
    return response
  },
  error: (error) => {
    // 에러 처리
    console.error('Error:', error.message)
    return Promise.reject(error)
  },
})
```

### 개별 요청에 재시도 설정

```typescript
const response = await client.get('/api/users', {
  retry: 3,
  retryDelay: 1000,
})
```

## 유틸리티 함수

### URL 쿼리 파라미터 추가

```typescript
import { addQueryParams } from '@hyunjin/http-client'

const url = addQueryParams('/api/users', {
  page: 1,
  limit: 10,
  search: 'john',
})
// 결과: '/api/users?page=1&limit=10&search=john'
```

### 인증 헤더 추가

```typescript
import { addAuthHeader } from '@hyunjin/http-client'

const config = addAuthHeader({}, 'your-token')
// 결과: { headers: { Authorization: 'Bearer your-token' } }
```

### FormData 생성

```typescript
import { createFormData } from '@hyunjin/http-client'

const formData = createFormData({
  name: 'John Doe',
  file: fileInput.files[0],
  metadata: { type: 'profile' },
})
```

### 에러 메시지 추출

```typescript
import { extractErrorMessage } from '@hyunjin/http-client'

try {
  await client.get('/api/users')
} catch (error) {
  const message = extractErrorMessage(error)
  console.error(message)
}
```

### HTTP 상태 코드 확인

```typescript
import { isSuccessStatus, isClientError, isServerError } from '@hyunjin/http-client'

const response = await client.get('/api/users')

if (isSuccessStatus(response.status)) {
  console.log('성공')
} else if (isClientError(response.status)) {
  console.log('클라이언트 에러')
} else if (isServerError(response.status)) {
  console.log('서버 에러')
}
```

## 타입 정의

```typescript
import { HttpClient, HttpClientConfig, RequestConfig } from '@hyunjin/http-client'

// HTTP 클라이언트 인터페이스
interface HttpClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
  delete<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  head<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
  options<T = any>(url: string, config?: RequestConfig): Promise<Response<T>>
}
```

## 개발

### 빌드

```bash
pnpm build
```

### 개발 모드

```bash
pnpm dev
```

### 테스트

```bash
# 테스트 실행 (watch 모드)
pnpm test

# 테스트 실행 (한 번만)
pnpm test:run

# 테스트 UI 실행
pnpm test:ui
```

### 린트

```bash
pnpm lint
```

## 라이선스

MIT
