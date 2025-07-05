/**
 * React Compiler 패키지의 메인 진입점
 *
 * 이 파일은 React Compiler Babel 플러그인을 외부에서 사용할 수 있도록
 * 필요한 함수와 타입을 export합니다.
 */

/**
 * 전역 __DEV__ 변수 선언
 * 개발/프로덕션 환경을 구분하는 용도로 사용됩니다.
 */
declare global {
  let __DEV__: boolean | null | undefined
}

// Babel 플러그인을 실행하는 함수 export
export { runBabelPluginReactCompiler } from './Babel/RunReactCompilerBabelPlugin'

// 기본 export로 Babel 플러그인 제공
import BabelPluginReactCompiler from './Babel/BabelPlugin'
export default BabelPluginReactCompiler
