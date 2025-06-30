"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = advancedBabelPlugin;
// 플러그인 상태를 저장할 WeakMap
const pluginStateMap = new WeakMap();
function advancedBabelPlugin(babel) {
    const { types: t, template } = babel;
    return {
        name: 'advanced-babel-plugin',
        // 플러그인 초기화 시 실행
        pre() {
            // this에 대한 타입 문제를 피하기 위해 WeakMap 사용
            pluginStateMap.set(this, new Set());
        },
        visitor: {
            // 1. 프로그램 시작 시 import 추가
            Program: {
                exit(path, state) {
                    const imports = pluginStateMap.get(state);
                    if (imports?.has('useState')) {
                        const importDeclaration = t.importDeclaration([t.importSpecifier(t.identifier('useState'), t.identifier('useState'))], t.stringLiteral('react'));
                        path.unshiftContainer('body', importDeclaration);
                    }
                },
            },
            // 2. 화살표 함수를 일반 함수로 변환
            ArrowFunctionExpression(path, state) {
                const opts = state.opts;
                // 옵션으로 제어 가능
                if (opts.transformArrowFunctions) {
                    const body = t.isExpression(path.node.body)
                        ? t.blockStatement([t.returnStatement(path.node.body)])
                        : path.node.body;
                    path.replaceWith(t.functionExpression(null, path.node.params, body, path.node.generator ?? false, path.node.async ?? false));
                }
            },
            // 3. JSX에 자동으로 key prop 추가
            JSXElement(path) {
                const openingElement = path.node.openingElement;
                const hasKey = openingElement.attributes.some((attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'key');
                if (!hasKey && path.parent.type === 'ArrayExpression') {
                    openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(t.identifier('index'))));
                }
            },
            // 4. 함수 호출 추적 및 로깅
            CallExpression(path, state) {
                const callee = path.node.callee;
                // fetch 호출 추적
                if (t.isIdentifier(callee, { name: 'fetch' })) {
                    // fetch 호출 전후로 로깅 추가
                    const logBefore = template(`console.log('Fetching:', ARGS);`)({
                        ARGS: path.node.arguments[0],
                    });
                    const logAfter = template(`
            RESULT.then(res => {
              console.log('Fetch completed:', res.status);
              return res;
            })
          `)({
                        RESULT: path.node,
                    });
                    path.insertBefore(logBefore);
                    path.replaceWith(logAfter.expression);
                }
                // React Hook 사용 추적
                if (t.isIdentifier(callee) && callee.name === 'useState') {
                    const imports = pluginStateMap.get(state);
                    imports?.add('useState');
                }
            },
            // 5. 디버깅을 위한 노드 정보 출력
            Identifier(path, state) {
                const opts = state.opts;
                // 특정 변수명 추적
                if (path.node.name === 'debugMe' && opts.debug) {
                    console.log('Found debugMe at:', {
                        line: path.node.loc?.start.line,
                        column: path.node.loc?.start.column,
                        parentType: path.parent.type,
                    });
                }
            },
        },
        // 플러그인 종료 시 실행
        post() {
            const imports = pluginStateMap.get(this);
            if (imports && imports.size > 0) {
                console.log('플러그인 처리 완료');
                console.log('Import된 모듈:', Array.from(imports));
            }
            // 메모리 정리
            pluginStateMap.delete(this);
        },
    };
}
//# sourceMappingURL=advanced-example.js.map