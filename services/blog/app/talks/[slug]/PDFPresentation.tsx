'use client'

import { useEffect, useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

interface PDFPresentationProps {
  pdfUrl: string
  title: string
}

export default function PDFPresentation({ pdfUrl, title }: PDFPresentationProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // PDF.js worker 설정 (클라이언트 사이드에서만 실행)
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
    }

    // 초기 윈도우 크기 설정
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // 윈도우 리사이즈 핸들러
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // PDF 로드 완료 핸들러
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        setCurrentPage((prev) => Math.min(prev + 1, numPages))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentPage(1)
      } else if (e.key === 'End') {
        e.preventDefault()
        setCurrentPage(numPages)
      }
    },
    [numPages],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 페이지 변경 핸들러
  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => Math.min(prev + 1, numPages))
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => Math.max(prev - 1, 1))
    }
  }

  // 풀스크린 토글
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // 풀스크린 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // PDF 크기 계산 (16:9 비율 유지하면서 가로 너비에 맞춤)
  const calculatePdfDimensions = useCallback(() => {
    if (typeof window === 'undefined' || !windowSize.width || !windowSize.height) {
      return { width: 800, height: 450 }
    }

    const aspectRatio = 16 / 9
    const width = windowSize.width
    const height = width / aspectRatio

    return { width, height }
  }, [windowSize])

  const { width: pdfWidth, height: pdfHeight } = calculatePdfDimensions()

  return (
    <div className="flex fixed inset-0 flex-col bg-gray-50 dark:bg-gray-950">
      {/* 프로그레스 바 */}
      <div className="absolute top-0 left-0 z-50 w-full h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full transition-all duration-300 ease-out bg-primary-500"
          style={{ width: numPages ? `${(currentPage / numPages) * 100}%` : '0%' }}
        />
      </div>

      {/* 헤더 */}
      <div
        className={`z-40 flex-shrink-0 px-4 py-3 bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-transform duration-300 ${
          isFullscreen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate dark:text-gray-100">{title}</h1>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              title={isFullscreen ? '풀스크린 종료' : '풀스크린'}
            >
              {isFullscreen ? '□' : '⛶'}
            </button>
            <a
              href="/talks"
              className="ml-4 text-sm whitespace-nowrap text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              ← Talks
            </a>
          </div>
        </div>
      </div>

      {/* PDF 뷰어 */}
      <div className="flex overflow-auto flex-col flex-1 justify-start items-center bg-black">
        <div className="bg-white shadow-2xl dark:bg-gray-800" style={{ width: pdfWidth, height: pdfHeight }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={{
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
              standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            }}
            loading={
              <div className="flex justify-center items-center w-full" style={{ height: pdfHeight }}>
                <div className="text-center">
                  <div className="inline-block w-12 h-12 rounded-full border-4 border-gray-200 animate-spin border-t-primary-500"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">PDF 로딩 중...</p>
                </div>
              </div>
            }
            error={
              <div className="flex justify-center items-center w-full" style={{ height: pdfHeight }}>
                <div className="text-center">
                  <p className="text-red-500">PDF를 불러올 수 없습니다.</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">파일 경로를 확인해주세요.</p>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              width={pdfWidth}
              // renderMode="svg"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={null}
            />
          </Document>
        </div>

        {/* 네비게이션 화살표 (큰 화면용) */}
        {currentPage > 1 && (
          <button
            onClick={goToPrevPage}
            className="hidden fixed left-4 top-1/2 z-30 p-3 text-white bg-black bg-opacity-30 rounded-full backdrop-blur-sm transition-all -translate-y-1/2 md:block hover:bg-opacity-50"
            aria-label="이전 슬라이드"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {currentPage < numPages && (
          <button
            onClick={goToNextPage}
            className="hidden fixed right-4 top-1/2 z-30 p-3 text-white bg-black bg-opacity-30 rounded-full backdrop-blur-sm transition-all -translate-y-1/2 md:block hover:bg-opacity-50"
            aria-label="다음 슬라이드"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* 하단 컨트롤 */}
      <div
        className={`flex-shrink-0 px-4 py-4 bg-white border-t border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700 transition-transform duration-300 ${
          isFullscreen ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-between items-center mx-auto max-w-4xl">
          {/* 이전 버튼 */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ← 이전
          </button>

          {/* 페이지 정보 */}
          <div className="flex gap-3 items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPage} / {numPages || '...'}
            </span>
            <div className="hidden gap-2 md:flex">
              {(() => {
                // 현재 페이지를 중심으로 표시할 페이지 범위 계산
                const maxDots = 10
                const halfWindow = Math.floor(maxDots / 2)

                let startPage = Math.max(1, currentPage - halfWindow)
                let endPage = Math.min(numPages, startPage + maxDots - 1)

                // endPage가 numPages에 가까우면 startPage 조정
                if (endPage - startPage < maxDots - 1) {
                  startPage = Math.max(1, endPage - maxDots + 1)
                }

                const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

                return (
                  <>
                    {startPage > 1 && <span className="text-gray-400 dark:text-gray-600">...</span>}
                    {pages.map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentPage === page
                            ? 'bg-primary-500 w-4'
                            : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`${page}페이지로 이동`}
                      />
                    ))}
                    {endPage < numPages && <span className="text-gray-400 dark:text-gray-600">...</span>}
                  </>
                )
              })()}
            </div>
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            다음 →
          </button>
        </div>

        {/* 키보드 힌트 */}
        <div className="hidden mt-3 text-xs text-center text-gray-500 md:block dark:text-gray-500">
          키보드: ← → (이전/다음) | Space (다음) | Home (처음) | End (마지막)
        </div>
      </div>

      {/* 풀스크린 모드에서 컨트롤 표시 (마우스 이동 시) */}
      {isFullscreen && (
        <div className="fixed inset-x-0 bottom-0 z-40 opacity-0 transition-opacity duration-300 group hover:opacity-100">
          <div className="px-4 py-3 mx-auto bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="flex justify-between items-center mx-auto max-w-4xl">
              <button
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                className="px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:bg-opacity-20"
              >
                ← 이전
              </button>
              <span className="text-sm font-medium text-white">
                {currentPage} / {numPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= numPages}
                className="px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:bg-opacity-20"
              >
                다음 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
