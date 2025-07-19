import {
  httpClient,
  createHttpClient,
  createApiClient,
  createUploadClient,
  addQueryParams,
  addAuthHeader,
  extractErrorMessage,
  isSuccessStatus,
} from '../src'

// 1. 기본 HTTP 클라이언트 사용
async function basicUsage() {
  try {
    // GET 요청
    const users = await httpClient.get('https://jsonplaceholder.typicode.com/users')
    console.log('Users:', users.data)

    // POST 요청
    const newUser = await httpClient.post('https://jsonplaceholder.typicode.com/users', {
      name: 'John Doe',
      email: 'john@example.com',
    })
    console.log('New user:', newUser.data)
  } catch (error) {
    console.error('Error:', extractErrorMessage(error))
  }
}

// 2. 커스텀 설정으로 클라이언트 생성
async function customClientUsage() {
  const client = createHttpClient({
    baseURL: 'https://api.example.com',
    timeout: 10000,
    headers: {
      'X-API-Key': 'your-api-key',
    },
  })

  try {
    const data = await client.get('/users')
    console.log('Custom client data:', data.data)
  } catch (error) {
    console.error('Custom client error:', extractErrorMessage(error))
  }
}

// 3. API 서버용 클라이언트
async function apiClientUsage() {
  const apiClient = createApiClient('https://jsonplaceholder.typicode.com')

  try {
    // baseURL이 자동으로 적용됩니다
    const posts = await apiClient.get('/posts')
    console.log('Posts:', posts.data)

    // 쿼리 파라미터 추가
    const url = addQueryParams('/posts', { userId: 1, _limit: 5 })
    const userPosts = await apiClient.get(url)
    console.log('User posts:', userPosts.data)
  } catch (error) {
    console.error('API client error:', extractErrorMessage(error))
  }
}

// 4. 인증 토큰 사용
async function authenticatedRequest() {
  const client = createHttpClient()
  const token = 'your-auth-token'

  try {
    const config = addAuthHeader({}, token)
    const profile = await client.get('/api/profile', config)
    console.log('Profile:', profile.data)
  } catch (error) {
    console.error('Auth error:', extractErrorMessage(error))
  }
}

// 5. 재시도 로직 테스트
async function retryLogic() {
  const client = createHttpClient()

  // 재시도 설정 업데이트
  client.setRetryConfig({
    retries: 3,
    retryDelay: 1000,
  })

  try {
    // 네트워크 에러가 발생하면 자동으로 재시도됩니다
    const response = await client.get('https://httpstat.us/500')
    console.log('Response after retry:', response.data)
  } catch (error) {
    console.error('Retry failed:', extractErrorMessage(error))
  }
}

// 6. 인터셉터 사용
async function interceptorUsage() {
  const client = createHttpClient()

  // 인터셉터 추가
  client.addInterceptor({
    request: (config) => {
      console.log('Request:', config.method?.toUpperCase(), config.url)
      return config
    },
    response: (response) => {
      console.log('Response:', response.status, response.config.url)
      return response
    },
    error: (error) => {
      console.error('Request failed:', error.config?.url, error.message)
      return Promise.reject(error)
    },
  })

  try {
    const response = await client.get('https://jsonplaceholder.typicode.com/users/1')
    console.log('User data:', response.data)
  } catch (error) {
    console.error('Interceptor error:', extractErrorMessage(error))
  }
}

// 7. 상태 코드 확인
async function statusCodeCheck() {
  try {
    const response = await httpClient.get('https://httpstat.us/200')

    if (isSuccessStatus(response.status)) {
      console.log('요청이 성공했습니다!')
    } else {
      console.log('요청이 실패했습니다.')
    }
  } catch (error) {
    console.error('Status check error:', extractErrorMessage(error))
  }
}

// 모든 예제 실행
async function runExamples() {
  console.log('=== HTTP Client Examples ===\n')

  console.log('1. Basic Usage:')
  await basicUsage()
  console.log()

  console.log('2. Custom Client:')
  await customClientUsage()
  console.log()

  console.log('3. API Client:')
  await apiClientUsage()
  console.log()

  console.log('4. Authenticated Request:')
  await authenticatedRequest()
  console.log()

  console.log('5. Retry Logic:')
  await retryLogic()
  console.log()

  console.log('6. Interceptor:')
  await interceptorUsage()
  console.log()

  console.log('7. Status Code Check:')
  await statusCodeCheck()
  console.log()
}

// 예제 실행 (주석 해제하여 실행)
// runExamples().catch(console.error);

export {
  basicUsage,
  customClientUsage,
  apiClientUsage,
  authenticatedRequest,
  retryLogic,
  interceptorUsage,
  statusCodeCheck,
  runExamples,
}
