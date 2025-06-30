"use strict";
// 바벨 플러그인 개발을 위한 유틸리티 함수와 타입들
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeBuilder = void 0;
exports.isConsoleMethod = isConsoleMethod;
exports.getFunctionName = getFunctionName;
exports.findVariableScope = findVariableScope;
exports.getJSXElementName = getJSXElementName;
exports.shouldProcessFile = shouldProcessFile;
const t = __importStar(require("@babel/types"));
/**
 * 노드가 특정 패턴과 일치하는지 확인하는 헬퍼 함수
 */
function isConsoleMethod(node, methodName) {
    return (t.isMemberExpression(node) &&
        t.isIdentifier(node.object, { name: 'console' }) &&
        t.isIdentifier(node.property, { name: methodName }));
}
/**
 * 함수 이름을 가져오는 헬퍼
 */
function getFunctionName(path) {
    // 함수 선언
    if (t.isFunctionDeclaration(path.node) && path.node.id) {
        return path.node.id.name;
    }
    // 변수에 할당된 함수
    if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
        return path.parent.id.name;
    }
    // 객체 메서드
    if (t.isObjectMethod(path.parent) && t.isIdentifier(path.parent.key)) {
        return path.parent.key.name;
    }
    return null;
}
/**
 * 변수가 선언된 스코프 찾기
 */
function findVariableScope(path, name) {
    let currentPath = path;
    while (currentPath) {
        if (currentPath.scope.hasBinding(name)) {
            return currentPath;
        }
        currentPath = currentPath.parent ? currentPath.parentPath : null;
    }
    return null;
}
/**
 * JSX 엘리먼트 이름 가져오기
 */
function getJSXElementName(element) {
    if (t.isJSXFragment(element)) {
        return 'Fragment';
    }
    const opening = element.openingElement;
    if (t.isJSXIdentifier(opening.name)) {
        return opening.name.name;
    }
    if (t.isJSXMemberExpression(opening.name)) {
        return `${getJSXMemberExpressionName(opening.name)}`;
    }
    return 'Unknown';
}
function getJSXMemberExpressionName(expr) {
    const object = t.isJSXMemberExpression(expr.object) ? getJSXMemberExpressionName(expr.object) : expr.object.name;
    return `${object}.${expr.property.name}`;
}
/**
 * 안전하게 AST 노드 생성하기
 */
class NodeBuilder {
    constructor(t) {
        this.t = t;
    }
    /**
     * console 메서드 호출 생성
     */
    consoleCall(method, args) {
        return this.t.callExpression(this.t.memberExpression(this.t.identifier('console'), this.t.identifier(method)), args);
    }
    /**
     * import 구문 생성
     */
    namedImport(specifiers, source) {
        const importSpecifiers = specifiers.map(({ imported, local }) => this.t.importSpecifier(this.t.identifier(local || imported), this.t.identifier(imported)));
        return this.t.importDeclaration(importSpecifiers, this.t.stringLiteral(source));
    }
    /**
     * try-catch 블록으로 감싸기
     */
    wrapInTryCatch(statements, errorHandler) {
        const catchClause = this.t.catchClause(this.t.identifier('error'), this.t.blockStatement(errorHandler
            ? errorHandler(this.t.identifier('error'))
            : [this.t.expressionStatement(this.consoleCall('error', [this.t.identifier('error')]))]));
        return this.t.tryStatement(this.t.blockStatement(statements), catchClause);
    }
}
exports.NodeBuilder = NodeBuilder;
/**
 * 파일이 처리 대상인지 확인
 */
function shouldProcessFile(filename, options) {
    if (!filename)
        return true;
    // exclude 패턴 확인
    if (options.exclude) {
        for (const pattern of options.exclude) {
            if (filename.includes(pattern)) {
                return false;
            }
        }
    }
    // include 패턴 확인
    if (options.include) {
        for (const pattern of options.include) {
            if (filename.includes(pattern)) {
                return true;
            }
        }
        return false;
    }
    return true;
}
//# sourceMappingURL=utils.js.map