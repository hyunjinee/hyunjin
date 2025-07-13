import type { PluginObj, PluginPass } from '@babel/core'
import type { NodePath } from '@babel/traverse'
import type * as BabelTypes from '@babel/types'

/**
 * Babel plugin that transforms `undefined` to `void 0`
 * 
 * Why? 
 * - `undefined` is a global variable that can be reassigned (in non-strict mode)
 * - `void 0` always returns undefined and is often shorter
 * - This transformation can improve code safety and sometimes reduce bundle size
 * 
 * Example:
 * - Input: `if (foo === undefined) { ... }`
 * - Output: `if (foo === void 0) { ... }`
 */
export default function undefinedToVoidPlugin(babel: typeof import('@babel/core')): PluginObj<PluginPass> {
  const { types: t } = babel
  
  return {
    name: 'babel-plugin-undefined-to-void',
    visitor: {
      Identifier(path: NodePath<BabelTypes.Identifier>) {
        // undefined를 void 0으로 변환
        if (path.node.name === 'undefined' && path.isReferencedIdentifier()) {
          // undefined가 함수 매개변수나 변수 선언에서 사용되는 경우는 제외
          if (!path.isBindingIdentifier()) {
            // 현재 스코프에서 undefined가 바인딩되어 있는지 확인
            const binding = path.scope.getBinding('undefined')
            if (!binding) {
              // undefined가 바인딩되어 있지 않으면 전역 undefined이므로 변환
              const voidExpression = t.unaryExpression(
                'void',
                t.numericLiteral(0),
                true
              )
              path.replaceWith(voidExpression)
            }
          }
        }
      },
      
      // undefined를 직접 할당하는 경우도 처리
      AssignmentPattern(path: NodePath<BabelTypes.AssignmentPattern>) {
        if (
          t.isIdentifier(path.node.right) &&
          path.node.right.name === 'undefined'
        ) {
          // 현재 스코프에서 undefined가 바인딩되어 있는지 확인
          const binding = path.scope.getBinding('undefined')
          if (!binding) {
            const voidExpression = t.unaryExpression(
              'void',
              t.numericLiteral(0),
              true
            )
            path.node.right = voidExpression
          }
        }
      }
    }
  }
}