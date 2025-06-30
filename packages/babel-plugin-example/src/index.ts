// 바벨 플러그인 예제: console.log를 myLogger.log로 변환
import type { PluginObj, PluginPass } from '@babel/core'
import type { NodePath } from '@babel/traverse'
import type * as BabelTypes from '@babel/types'

export default function transformConsoleLog(babel: typeof import('@babel/core')): PluginObj<PluginPass> {
  const { types: t } = babel

  return {
    name: 'transform-console-log',
    visitor: {
      // CallExpression 노드를 방문
      CallExpression(path: NodePath<BabelTypes.CallExpression>) {
        // console.log인지 확인
        const { callee } = path.node

        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'console' }) &&
          t.isIdentifier(callee.property, { name: 'log' })
        ) {
          // myLogger.log로 변환
          path.node.callee = t.memberExpression(t.identifier('myLogger'), t.identifier('log'))
        }
      },
    },
  }
}
