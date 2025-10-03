import axios from 'axios'
import { createWriteStream, promises as fs } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

export class FileDownloader {
  private maxSizeMB: number
  private timeout: number

  constructor(maxSizeMB: number = 10, timeout: number = 30000) {
    this.maxSizeMB = maxSizeMB
    this.timeout = timeout
  }

  async downloadFromUrl(url: string): Promise<{ filePath: string; fileType: string; fileSize: number }> {
    try {
      // URL 검증
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('지원하지 않는 프로토콜입니다. HTTP 또는 HTTPS만 지원됩니다.')
      }

      // HEAD 요청으로 파일 정보 확인
      const headResponse = await axios.head(url, { timeout: this.timeout })
      const contentLength = parseInt(headResponse.headers['content-length'] || '0')
      const contentType = headResponse.headers['content-type'] || ''

      // 파일 크기 검증
      if (contentLength > this.maxSizeMB * 1024 * 1024) {
        throw new Error(`파일 크기가 ${this.maxSizeMB}MB를 초과합니다.`)
      }

      // 파일 타입 검증
      const supportedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
      ]

      if (!supportedTypes.includes(contentType)) {
        throw new Error(`지원하지 않는 파일 형식입니다: ${contentType}`)
      }

      // 임시 파일 경로 생성
      const fileName = `resume_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const extension = this.getExtensionFromContentType(contentType)
      const filePath = join(tmpdir(), `${fileName}.${extension}`)

      // 파일 다운로드
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
        timeout: this.timeout,
      })

      const writer = createWriteStream(filePath)
      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on('finish', async () => {
          try {
            const stats = await fs.stat(filePath)
            resolve({
              filePath,
              fileType: contentType,
              fileSize: stats.size,
            })
          } catch (error) {
            reject(new Error(`파일 정보 확인 중 오류: ${error}`))
          }
        })

        writer.on('error', (error) => {
          reject(new Error(`파일 다운로드 중 오류: ${error.message}`))
        })
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ENOTFOUND') {
          throw new Error('URL을 찾을 수 없습니다.')
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('다운로드 시간 초과')
        }
      }
      throw error
    }
  }

  private getExtensionFromContentType(contentType: string): string {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'doc',
      'text/plain': 'txt',
    }

    return typeMap[contentType] || 'unknown'
  }

  async cleanupFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.warn(`임시 파일 삭제 실패: ${filePath}`, error)
    }
  }
}
