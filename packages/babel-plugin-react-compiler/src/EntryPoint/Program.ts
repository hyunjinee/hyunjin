/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * React Compiler 지시어(Directive) 정의
 *
 * 이 파일은 React Compiler의 동작을 제어하는 지시어들을 정의합니다.
 * 개발자가 파일이나 함수 단위로 컴파일러의 최적화를 활성화/비활성화할 수 있습니다.
 */

import { NodePath } from '@babel/core'
import * as t from '@babel/types'
import { PluginOptions } from './Options'
import { CompilerError } from '../CompileError'
import { ProgramContext } from './Imports'

export type CompilerPass = {
  opts: PluginOptions
  filename: string | null
  comments: Array<t.CommentBlock | t.CommentLine>
  code: string | null
}

/**
 * 컴파일러 활성화 지시어 (Opt-in)
 *
 * 이 지시어들을 사용하면 해당 범위에서 React Compiler가 활성화됩니다.
 * - 'use forget': React Forget 컴파일러 활성화
 * - 'use memo': 자동 메모이제이션 활성화
 *
 * 사용 예:
 * ```javascript
 * 'use forget';
 * function MyComponent() {
 *   // 이 컴포넌트는 컴파일러에 의해 최적화됩니다
 * }
 * ```
 */
export const OPT_IN_DIRECTIVES = new Set(['use forget', 'use memo'])

/**
 * 컴파일러 비활성화 지시어 (Opt-out)
 *
 * 이 지시어들을 사용하면 해당 범위에서 React Compiler가 비활성화됩니다.
 * - 'use no forget': React Forget 컴파일러 비활성화
 * - 'use no memo': 자동 메모이제이션 비활성화
 *
 * 사용 예:
 * ```javascript
 * 'use no forget';
 * function ComplexComponent() {
 *   // 이 컴포넌트는 컴파일러에 의해 최적화되지 않습니다
 *   // (예: 컴파일러가 제대로 처리하지 못하는 복잡한 로직이 있는 경우)
 * }
 * ```
 */
export const OPT_OUT_DIRECTIVES = new Set(['use no forget', 'use no memo'])

/**
 * 동적 게이팅 지시어 패턴
 *
 * 조건부 메모이제이션을 위한 정규표현식
 * 예: 'use memo if(condition)'
 */
const DYNAMIC_GATING_DIRECTIVE = new RegExp('^use memo if\\(([^\\)]*)\\)$')

/**
 * 메모이제이션 활성화 지시어를 찾는 함수
 *
 * @returns 메모이제이션 지시어 정보 또는 null
 *
 * TODO: 실제 구현 필요
 */
export function tryFindDirectiveEnablingMemoization(): null {
  // TODO: 구현 필요
  return null
}

export type BabelFn =
  | NodePath<t.FunctionDeclaration>
  | NodePath<t.FunctionExpression>
  | NodePath<t.ArrowFunctionExpression>

export type CompileProgramMetadata = {
  retryErrors: Array<{ fn: BabelFn; error: CompilerError }>
  inferredEffectLocations: Set<t.SourceLocation>
}

/**
 * Main entrypoint for React Compiler.
 *
 * @param program The Babel program node to compile
 * @param pass Compiler configuration and context
 * @returns Compilation results or null if compilation was skipped
 */
export function compileProgram(program: NodePath<t.Program>, pass: CompilerPass): CompileProgramMetadata | null {
  const programContext = new ProgramContext({
    program,
  })

  return {
    retryErrors: [],
    inferredEffectLocations: new Set(),
  }
}

function isNonNode(node?: t.Expression | null): boolean {
  if (!node) {
    return true
  }
  switch (node.type) {
    case 'ObjectExpression':
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
    case 'BigIntLiteral':
    case 'ClassExpression':
    case 'NewExpression': // technically `new Array()` is legit, but unlikely
      return true
  }
  return false
}
