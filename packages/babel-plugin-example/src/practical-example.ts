// 실용적인 바벨 플러그인: 성능 모니터링과 에러 처리
import type { PluginObj, PluginPass } from '@babel/core'
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { NodeBuilder, getFunctionName, shouldProcessFile, BasePluginOptions } from './utils'

interface PracticalPluginOptions extends BasePluginOptions {
  /** 성능 모니터링을 추가할 함수들 */
  monitorFunctions?: string[]
  /** 자동 에러 처리를 추가할 함수들 */
  wrapWithTryCatch?: string[]
  /** 비동기 함수에 자동으로 에러 처리 추가 */
  autoWrapAsync?: boolean
  /** 성능 임계값 (ms) */
  performanceThreshold?: number
}

export default function practicalBabelPlugin(babel: typeof import('@babel/core')): PluginObj<PluginPass> {
  const { types: t, template } = babel
  const nodeBuilder = new NodeBuilder(t)

  return {
    name: 'practical-babel-plugin',

    visitor: {
      Program(path: NodePath<t.Program>, state) {
        const opts = state.opts as PracticalPluginOptions

        // 파일이 처리 대상인지 확인
        if (!shouldProcessFile(state.filename, opts)) {
          return
        }

        // 성능 모니터링을 위한 헬퍼 함수 추가
        if (opts.monitorFunctions?.length || opts.performanceThreshold) {
          const perfHelper = template(`
            const __measurePerformance = (fn, name) => {
              return async function(...args) {
                const start = performance.now();
                try {
                  const result = await fn.apply(this, args);
                  const duration = performance.now() - start;
                  if (duration > ${opts.performanceThreshold || 100}) {
                    console.warn(\`⚠️ \${name} took \${duration.toFixed(2)}ms\`);
                  }
                  return result;
                } catch (error) {
                  console.error(\`❌ Error in \${name}:\`, error);
                  throw error;
                }
              };
            };
          `)()

          path.node.body.unshift(perfHelper as t.Statement)
        }
      },

      // 함수에 성능 모니터링 추가
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>, state) {
        const opts = state.opts as PracticalPluginOptions
        const functionName = getFunctionName(path)

        if (!functionName || !opts.monitorFunctions?.includes(functionName)) {
          return
        }

        // 함수를 변수로 저장하고 모니터링 래퍼 적용
        const wrappedFunction = t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(functionName),
            t.callExpression(t.identifier('__measurePerformance'), [
              t.functionExpression(null, path.node.params, path.node.body, path.node.generator, path.node.async),
              t.stringLiteral(functionName),
            ]),
          ),
        ])

        path.replaceWith(wrappedFunction)
      },

      // 비동기 함수에 자동 에러 처리 추가
      ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>, state) {
        const opts = state.opts as PracticalPluginOptions

        if (!opts.autoWrapAsync || !path.node.async) {
          return
        }

        // 이미 try-catch로 감싸져 있는지 확인
        if (
          t.isBlockStatement(path.node.body) &&
          path.node.body.body.length === 1 &&
          t.isTryStatement(path.node.body.body[0])
        ) {
          return
        }

        const body = t.isExpression(path.node.body) ? [t.returnStatement(path.node.body)] : path.node.body.body

        const wrappedBody = nodeBuilder.wrapInTryCatch(body, (error) => [
          t.expressionStatement(nodeBuilder.consoleCall('error', [t.stringLiteral('Async function error:'), error])),
          t.throwStatement(error),
        ])

        path.node.body = t.blockStatement([wrappedBody])
      },

      // API 호출에 재시도 로직 추가
      AwaitExpression(path: NodePath<t.AwaitExpression>) {
        if (!t.isCallExpression(path.node.argument)) {
          return
        }

        const callee = path.node.argument.callee
        if (!t.isIdentifier(callee, { name: 'fetch' })) {
          return
        }

        // fetch를 재시도 로직으로 감싸기
        const retryFetchTemplate = template.expression(`
          (async () => {
            let retries = 3;
            while (retries > 0) {
              try {
                return await ORIGINAL_CALL;
              } catch (error) {
                retries--;
                if (retries === 0) throw error;
                console.log(\`Retrying... (\${3 - retries}/3)\`);
                await new Promise(r => setTimeout(r, 1000));
              }
            }
          })()
        `)

        const retryFetch = retryFetchTemplate({
          ORIGINAL_CALL: path.node.argument,
        })

        path.node.argument = retryFetch
      },

      // React 컴포넌트에 에러 경계 자동 추가
      JSXElement(path: NodePath<t.JSXElement>, state) {
        const opts = state.opts as PracticalPluginOptions

        // 최상위 JSX 요소인지 확인
        if (!t.isReturnStatement(path.parent)) {
          return
        }

        const componentName = path.findParent((p) => p.isFunctionDeclaration() || p.isVariableDeclarator())

        if (!componentName) {
          return
        }

        // ErrorBoundary로 감싸기 (옵션이 활성화된 경우)
        if (opts.wrapWithTryCatch?.includes('ReactComponents')) {
          const errorBoundary = t.jsxElement(
            t.jsxOpeningElement(
              t.jsxIdentifier('ErrorBoundary'),
              [
                t.jsxAttribute(
                  t.jsxIdentifier('fallback'),
                  t.jsxExpressionContainer(
                    t.jsxElement(
                      t.jsxOpeningElement(t.jsxIdentifier('div'), []),
                      t.jsxClosingElement(t.jsxIdentifier('div')),
                      [t.jsxText('Something went wrong')],
                    ),
                  ),
                ),
              ],
              false,
            ),
            t.jsxClosingElement(t.jsxIdentifier('ErrorBoundary')),
            [path.node],
            false,
          )

          path.replaceWith(errorBoundary)
        }
      },
    },
  }
}

// 사용 예시
/*
// babel.config.js
module.exports = {
  plugins: [
    ['./practical-example', {
      monitorFunctions: ['fetchUserData', 'processData'],
      wrapWithTryCatch: ['ReactComponents'],
      autoWrapAsync: true,
      performanceThreshold: 100,
      exclude: ['node_modules'],
      debug: true
    }]
  ]
};
*/
