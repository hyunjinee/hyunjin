// 바벨 플러그인 개발을 위한 유틸리티 함수와 타입들

import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

/**
 * 노드가 특정 패턴과 일치하는지 확인하는 헬퍼 함수
 */
export function isConsoleMethod(node: t.Node, methodName: string): node is t.MemberExpression {
  return (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.object, { name: 'console' }) &&
    t.isIdentifier(node.property, { name: methodName })
  )
}

/**
 * 함수 이름을 가져오는 헬퍼
 */
export function getFunctionName(path: NodePath<t.Function>): string | null {
  // 함수 선언
  if (t.isFunctionDeclaration(path.node) && path.node.id) {
    return path.node.id.name
  }

  // 변수에 할당된 함수
  if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
    return path.parent.id.name
  }

  // 객체 메서드
  if (t.isObjectMethod(path.parent) && t.isIdentifier(path.parent.key)) {
    return path.parent.key.name
  }

  return null
}

/**
 * 변수가 선언된 스코프 찾기
 */
export function findVariableScope(path: NodePath, name: string): NodePath | null {
  let currentPath: NodePath | null = path

  while (currentPath) {
    if (currentPath.scope.hasBinding(name)) {
      return currentPath
    }
    currentPath = currentPath.parent ? currentPath.parentPath : null
  }

  return null
}

/**
 * JSX 엘리먼트 이름 가져오기
 */
export function getJSXElementName(element: t.JSXElement | t.JSXFragment): string {
  if (t.isJSXFragment(element)) {
    return 'Fragment'
  }

  const opening = element.openingElement
  if (t.isJSXIdentifier(opening.name)) {
    return opening.name.name
  }

  if (t.isJSXMemberExpression(opening.name)) {
    return `${getJSXMemberExpressionName(opening.name)}`
  }

  return 'Unknown'
}

function getJSXMemberExpressionName(expr: t.JSXMemberExpression): string {
  const object = t.isJSXMemberExpression(expr.object) ? getJSXMemberExpressionName(expr.object) : expr.object.name

  return `${object}.${expr.property.name}`
}

/**
 * 안전하게 AST 노드 생성하기
 */
export class NodeBuilder {
  constructor(private t: typeof import('@babel/types')) {}

  /**
   * console 메서드 호출 생성
   */
  consoleCall(method: string, args: t.Expression[]): t.CallExpression {
    return this.t.callExpression(this.t.memberExpression(this.t.identifier('console'), this.t.identifier(method)), args)
  }

  /**
   * import 구문 생성
   */
  namedImport(specifiers: Array<{ imported: string; local?: string }>, source: string): t.ImportDeclaration {
    const importSpecifiers = specifiers.map(({ imported, local }) =>
      this.t.importSpecifier(this.t.identifier(local || imported), this.t.identifier(imported)),
    )

    return this.t.importDeclaration(importSpecifiers, this.t.stringLiteral(source))
  }

  /**
   * try-catch 블록으로 감싸기
   */
  wrapInTryCatch(statements: t.Statement[], errorHandler?: (error: t.Identifier) => t.Statement[]): t.TryStatement {
    const catchClause = this.t.catchClause(
      this.t.identifier('error'),
      this.t.blockStatement(
        errorHandler
          ? errorHandler(this.t.identifier('error'))
          : [this.t.expressionStatement(this.consoleCall('error', [this.t.identifier('error')]))],
      ),
    )

    return this.t.tryStatement(this.t.blockStatement(statements), catchClause)
  }
}

/**
 * 플러그인 옵션 타입
 */
export interface BasePluginOptions {
  /** 디버그 모드 활성화 */
  debug?: boolean
  /** 제외할 파일 패턴 */
  exclude?: string[]
  /** 포함할 파일 패턴 */
  include?: string[]
}

/**
 * 파일이 처리 대상인지 확인
 */
export function shouldProcessFile(filename: string | null | undefined, options: BasePluginOptions): boolean {
  if (!filename) return true

  // exclude 패턴 확인
  if (options.exclude) {
    for (const pattern of options.exclude) {
      if (filename.includes(pattern)) {
        return false
      }
    }
  }

  // include 패턴 확인
  if (options.include) {
    for (const pattern of options.include) {
      if (filename.includes(pattern)) {
        return true
      }
    }
    return false
  }

  return true
}
