/**
 * React Compiler Babel 플러그인 실행 유틸리티
 *
 * 이 파일은 React Compiler를 프로그래밍 방식으로 실행할 수 있는
 * 유틸리티 함수를 제공합니다. 주로 테스트나 CLI 도구에서 사용됩니다.
 */
import type * as BabelCore from '@babel/core'
import { transformFromAstSync } from '@babel/core'
import * as BabelParser from '@babel/parser'
import invariant from 'invariant'
import type { PluginOptions } from '../EntryPoint'
import BabelPluginReactCompiler from '..'

/**
 * React Compiler Babel 플러그인을 프로그래밍 방식으로 실행합니다.
 *
 * @param text - 컴파일할 소스 코드 문자열
 * @param file - 파일 경로 (소스맵과 에러 메시지에 사용)
 * @param language - 소스 코드의 언어 (Flow 또는 TypeScript)
 * @param options - 플러그인 옵션 (로거 등)
 * @param includeAst - 결과에 AST를 포함할지 여부 (기본값: false)
 * @returns Babel 변환 결과 (변환된 코드, 소스맵 등 포함)
 *
 * @example
 * ```typescript
 * const result = runBabelPluginReactCompiler(
 *   'function MyComponent() { return <div />; }',
 *   'MyComponent.tsx',
 *   'typescript',
 *   { logger: myLogger }
 * );
 * console.log(result.code); // 최적화된 코드
 * ```
 */
export function runBabelPluginReactCompiler(
  text: string,
  file: string,
  language: 'flow' | 'typescript',
  options: Partial<PluginOptions> | null,
  includeAst: boolean = false,
): BabelCore.BabelFileResult {
  // 1단계: 소스 코드를 AST로 파싱
  const ast = BabelParser.parse(text, {
    sourceFilename: file,
    plugins: [language, 'jsx'], // JSX와 선택한 언어 플러그인 활성화
    sourceType: 'module',
  })

  // 2단계: AST에 React Compiler 플러그인 적용
  const result = transformFromAstSync(ast as any, text, {
    ast: includeAst, // AST 포함 여부
    filename: file,
    highlightCode: false, // 코드 하이라이팅 비활성화 (성능 향상)
    retainLines: true, // 원본 줄 번호 유지 (디버깅 용이)
    plugins: [
      [BabelPluginReactCompiler, options], // React Compiler 플러그인
      'babel-plugin-fbt', // Facebook 번역 플러그인
      'babel-plugin-fbt-runtime', // Facebook 번역 런타임
    ],
    sourceType: 'module',
    configFile: false, // babel.config.js 무시
    babelrc: false, // .babelrc 무시
  })

  // 3단계: 결과 검증
  invariant(result?.code != null, `Expected BabelPluginReactForget to codegen successfully, got: ${result}`)

  return result
}
