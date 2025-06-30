// 고급 바벨 플러그인 예제
module.exports = function (babel) {
  const { types: t, template } = babel

  return {
    name: 'advanced-babel-plugin',

    // 플러그인 초기화 시 실행
    pre() {
      this.imports = new Set()
    },

    visitor: {
      // 1. 프로그램 시작 시 import 추가
      Program: {
        exit(path, state) {
          if (this.imports.has('useState')) {
            const importDeclaration = t.importDeclaration(
              [t.importSpecifier(t.identifier('useState'), t.identifier('useState'))],
              t.stringLiteral('react'),
            )
            path.unshiftContainer('body', importDeclaration)
          }
        },
      },

      // 2. 화살표 함수를 일반 함수로 변환
      ArrowFunctionExpression(path) {
        // 옵션으로 제어 가능
        if (this.opts.transformArrowFunctions) {
          path.replaceWith(
            t.functionExpression(null, path.node.params, t.blockStatement([t.returnStatement(path.node.body)])),
          )
        }
      },

      // 3. JSX에 자동으로 key prop 추가
      JSXElement(path) {
        const openingElement = path.node.openingElement
        const hasKey = openingElement.attributes.some((attr) => t.isJSXAttribute(attr) && attr.name.name === 'key')

        if (!hasKey && path.parent.type === 'ArrayExpression') {
          openingElement.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(t.identifier('index'))),
          )
        }
      },

      // 4. 특정 함수 호출 추적 및 로깅
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee, { name: 'fetch' })) {
          // fetch 호출 전후로 로깅 추가
          const logBefore = template(`console.log('Fetching:', ARGS);`)({
            ARGS: path.node.arguments[0],
          })

          const logAfter = template(`
            RESULT.then(res => {
              console.log('Fetch completed:', res.status);
              return res;
            })
          `)({
            RESULT: path.node,
          })

          path.insertBefore(logBefore)
          path.replaceWith(logAfter.expression)
        }
      },

      // 5. 디버깅을 위한 노드 정보 출력
      Identifier(path) {
        // 특정 변수명 추적
        if (path.node.name === 'debugMe' && this.opts.debug) {
          console.log('Found debugMe at:', {
            line: path.node.loc?.start.line,
            column: path.node.loc?.start.column,
            parentType: path.parent.type,
          })
        }
      },
    },

    // 플러그인 종료 시 실행
    post() {
      console.log('플러그인 처리 완료')
    },
  }
}

// 사용 예시:
/*
// .babelrc 또는 babel.config.js
{
  "plugins": [
    ["./advanced-example", {
      "transformArrowFunctions": true,
      "debug": true
    }]
  ]
}
*/
