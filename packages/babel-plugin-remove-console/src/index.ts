import type { NodePath } from '@babel/core';
import type * as t from '@babel/types';
import * as types from '@babel/types';

interface RemoveConsoleOptions {
  exclude?: string[];  // 제외할 console 메서드들 (예: ['error', 'warn'])
}

export default function removeConsolePlugin() {
  return {
    name: 'babel-plugin-remove-console',
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>, state: any) {
        const { exclude = [] } = state.opts || {};
        const callee = path.node.callee;

        // console.log, console.error 등을 찾기
        if (
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.object) &&
          callee.object.name === 'console' &&
          types.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;
          
          // exclude 옵션에 있는 메서드는 제거하지 않음
          if (!exclude.includes(methodName)) {
            // 전체 문장을 제거 (예: console.log('hello');)
            if (path.parentPath?.isExpressionStatement()) {
              path.parentPath.remove();
            } else {
              // 표현식의 일부인 경우 (예: const a = console.log('hello'))
              // void 0으로 대체
              path.replaceWith(
                types.unaryExpression('void', types.numericLiteral(0))
              );
            }
          }
        }
      }
    }
  };
}