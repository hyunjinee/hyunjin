"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformConsoleLog;
function transformConsoleLog(babel) {
    const { types: t } = babel;
    return {
        name: 'transform-console-log',
        visitor: {
            // CallExpression 노드를 방문
            CallExpression(path) {
                // console.log인지 확인
                const { callee } = path.node;
                if (t.isMemberExpression(callee) &&
                    t.isIdentifier(callee.object, { name: 'console' }) &&
                    t.isIdentifier(callee.property, { name: 'log' })) {
                    // myLogger.log로 변환
                    path.node.callee = t.memberExpression(t.identifier('myLogger'), t.identifier('log'));
                }
            },
        },
    };
}
//# sourceMappingURL=index.js.map