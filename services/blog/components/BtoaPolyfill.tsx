'use client'

import { useEffect } from 'react'

/**
 * btoa 함수를 유니코드를 지원하는 버전으로 패치합니다.
 * kbar 검색에서 한글 콘텐츠를 처리할 때 발생하는
 * "The string to be encoded contains characters outside of the Latin1 range" 에러를 해결합니다.
 */
export default function BtoaPolyfill() {
  useEffect(() => {
    // 원본 btoa 함수 저장
    const originalBtoa = window.btoa
    const originalAtob = window.atob

    // 유니코드를 지원하는 btoa 함수로 대체
    window.btoa = function (str: string): string {
      try {
        // TextEncoder를 사용하여 UTF-8 바이트 배열로 변환
        const bytes = new TextEncoder().encode(str)
        // 바이트 배열을 바이너리 문자열로 변환
        const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
        // 원본 btoa로 인코딩
        return originalBtoa(binString)
      } catch (e) {
        console.error('btoa encoding error:', e)
        // 에러 발생 시 원본 함수 사용 시도
        return originalBtoa(str)
      }
    }

    // 유니코드를 지원하는 atob 함수로 대체
    window.atob = function (str: string): string {
      try {
        // 원본 atob로 디코딩
        const binString = originalAtob(str)
        // 바이너리 문자열을 바이트 배열로 변환
        const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0))
        // TextDecoder를 사용하여 UTF-8 문자열로 변환
        return new TextDecoder().decode(bytes)
      } catch (e) {
        console.error('atob decoding error:', e)
        // 에러 발생 시 원본 함수 사용 시도
        return originalAtob(str)
      }
    }
  }, [])

  return null
}
