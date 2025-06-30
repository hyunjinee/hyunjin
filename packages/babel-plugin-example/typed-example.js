// JSDoc을 사용한 타입 안전 바벨 플러그인
/**
 * @typedef {Object} PluginOptions
 * @property {string} [customPrefix='transformed_'] - 변수명 앞에 붙일 prefix
 * @property {boolean} [enableLogging=false] - 로깅 활성화 여부
 */

/**
 * 타입 정보가 포함된 바벨 플러그인
 * @param {import('@babel/core')} babel - Babel 인스턴스
 * @returns {import('@babel/core').PluginObj} 플러그인 객체
 */
module.exports = function typedBabelPlugin(babel) {
  const { types: t } = babel

  /** @type {Set<string>} */
  const transformedVariables = new Set()

  return {
    name: 'typed-babel-plugin',

    /**
     * 플러그인 초기화
     * @this {import('@babel/core').PluginPass}
     */
    pre() {
      transformedVariables.clear()
    },

    visitor: {
      /**
       * 변수 선언 처리
       * @param {import('@babel/traverse').NodePath<import('@babel/types').VariableDeclaration>} path
       * @param {import('@babel/core').PluginPass & { opts: PluginOptions }} state
       */
      VariableDeclaration(path, state) {
        const { customPrefix = 'transformed_' } = state.opts || {}

        path.node.declarations.forEach((declaration) => {
          if (t.isIdentifier(declaration.id)) {
            const originalName = declaration.id.name
            declaration.id.name = `${customPrefix}${originalName}`
            transformedVariables.add(originalName)
          }
        })
      },

      /**
       * 함수 호출 처리
       * @param {import('@babel/traverse').NodePath<import('@babel/types').CallExpression>} path
       * @param {import('@babel/core').PluginPass & { opts: PluginOptions }} state
       */
      CallExpression(path, state) {
        const { enableLogging = false } = state.opts || {}

        if (enableLogging && t.isIdentifier(path.node.callee)) {
          const logStatement = t.expressionStatement(
            t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('log')), [
              t.stringLiteral(`[LOG] Calling function: ${path.node.callee.name}`),
              t.spreadElement(t.identifier('arguments')),
            ]),
          )

          path.insertBefore(logStatement)
        }
      },

      /**
       * JSX 요소 처리 - 개발 모드에서 디버그 정보 추가
       * @param {import('@babel/traverse').NodePath<import('@babel/types').JSXElement>} path
       */
      JSXElement(path) {
        if (process.env.NODE_ENV === 'development') {
          const openingElement = path.node.openingElement

          // data-debug 속성 추가
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('data-debug'),
              t.stringLiteral(`line:${path.node.loc?.start.line || 'unknown'}`),
            ),
          )
        }
      },

      /**
       * 화살표 함수에 이름 추가
       * @param {import('@babel/traverse').NodePath<import('@babel/types').ArrowFunctionExpression>} path
       */
      ArrowFunctionExpression(path) {
        // 부모가 변수 선언인 경우 함수 이름 추가
        if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
          const funcName = path.parent.id.name

          // 화살표 함수를 일반 함수 표현식으로 변환 (디버깅용)
          const funcExpression = t.functionExpression(
            t.identifier(funcName),
            path.node.params,
            t.isExpression(path.node.body) ? t.blockStatement([t.returnStatement(path.node.body)]) : path.node.body,
            path.node.generator,
            path.node.async,
          )

          path.replaceWith(funcExpression)
        }
      },
    },

    /**
     * 플러그인 종료 시 통계 출력
     * @this {import('@babel/core').PluginPass}
     */
    post() {
      if (transformedVariables.size > 0) {
        console.log(`✅ 변환된 변수들: ${Array.from(transformedVariables).join(', ')}`)
        console.log(`📊 총 ${transformedVariables.size}개의 변수가 변환되었습니다.`)
      }
    },
  }
}

// 사용 예시:
/*
// babel.config.js
module.exports = {
  plugins: [
    ['./typed-example', {
      customPrefix: 'my_',
      enableLogging: true
    }]
  ]
};
*/
