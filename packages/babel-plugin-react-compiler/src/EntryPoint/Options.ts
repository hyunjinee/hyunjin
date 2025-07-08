/**
 * React Compiler 플러그인 옵션 및 로거 타입 정의
 *
 * 이 파일은 플러그인에서 사용하는 설정 옵션과 로깅 관련 타입을 정의합니다.
 */
import * as t from '@babel/types'
import { z } from 'zod'

/**
 * 로거 이벤트의 기본 타입
 * 현재는 CompileErrorEvent만 지원하지만, 추후 확장 가능합니다.
 */
export type LoggerEvent = CompileSuccessEvent | CompileErrorEvent | TimingEvent

/**
 * 컴파일 오류 이벤트 타입
 * 컴파일 중 발생한 오류 정보를 담습니다.
 */
export type CompileErrorEvent = {
  /** 이벤트 종류 식별자 */
  kind: 'CompileError'
  /** 오류가 발생한 함수의 소스 위치 정보 (없을 수 있음) */
  fnLoc: t.SourceLocation | null
}

export type CompileSuccessEvent = {
  kind: 'CompileSuccess'
  fnLoc: t.SourceLocation | null
  fnName: string | null
  memoSlots: number
  memoBlocks: number
  memoValues: number
  prunedMemoBlocks: number
  prunedMemoValues: number
}

export type CompileSkipEvent = {
  kind: 'CompileSkip'
  fnLoc: t.SourceLocation | null
  reason: string
  loc: t.SourceLocation | null
}

export type PipelineErrorEvent = {
  kind: 'PipelineError'
  fnLoc: t.SourceLocation | null
  data: string
}

export type TimingEvent = {
  kind: 'Timing'
  measurement: PerformanceMeasure
}

/**
 * React Compiler 플러그인 옵션
 * Babel 플러그인에 전달되는 설정 옵션들을 정의합니다.
 */
export type PluginOptions = {
  /** 컴파일 과정을 로깅하는 로거 인스턴스 (선택사항) */
  logger: Logger | null

  /**
   * The minimum major version of React that the compiler should emit code for. If the target is 19
   * or higher, the compiler emits direct imports of React runtime APIs needed by the compiler. On
   * versions prior to 19, an extra runtime package react-compiler-runtime is necessary to provide
   * a userspace approximation of runtime APIs.
   */
  target: CompilerReactTarget
}

/**
 * 로거 인터페이스
 * 컴파일 과정에서 발생하는 이벤트를 기록하는 로거의 구조를 정의합니다.
 */
export type Logger = {
  /**
   * 이벤트를 로깅하는 메서드
   *
   * @param filename - 처리 중인 파일명 (없을 수 있음)
   * @param event - 로깅할 이벤트 객체
   */
  logEvent: (filename: string | null, event: LoggerEvent) => void
}

const CompilerReactTargetSchema = z.union([
  z.literal('17'),
  z.literal('18'),
  z.literal('19'),
  z.object({
    kind: z.literal('donotuse_meta_internal'),
    runtimeModule: z.string().default('react'),
  }),
])
export type CompilerReactTarget = z.infer<typeof CompilerReactTargetSchema>

export const defaultOptions: PluginOptions = {
  compilationMode: 'infer',
}

export function parsePluginOptions(obj: unknown): PluginOptions {
  return defaultOptions
}
