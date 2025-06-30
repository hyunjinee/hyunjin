import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
/**
 * 노드가 특정 패턴과 일치하는지 확인하는 헬퍼 함수
 */
export declare function isConsoleMethod(node: t.Node, methodName: string): node is t.MemberExpression;
/**
 * 함수 이름을 가져오는 헬퍼
 */
export declare function getFunctionName(path: NodePath<t.Function>): string | null;
/**
 * 변수가 선언된 스코프 찾기
 */
export declare function findVariableScope(path: NodePath, name: string): NodePath | null;
/**
 * JSX 엘리먼트 이름 가져오기
 */
export declare function getJSXElementName(element: t.JSXElement | t.JSXFragment): string;
/**
 * 안전하게 AST 노드 생성하기
 */
export declare class NodeBuilder {
    private t;
    constructor(t: typeof import('@babel/types'));
    /**
     * console 메서드 호출 생성
     */
    consoleCall(method: string, args: t.Expression[]): t.CallExpression;
    /**
     * import 구문 생성
     */
    namedImport(specifiers: Array<{
        imported: string;
        local?: string;
    }>, source: string): t.ImportDeclaration;
    /**
     * try-catch 블록으로 감싸기
     */
    wrapInTryCatch(statements: t.Statement[], errorHandler?: (error: t.Identifier) => t.Statement[]): t.TryStatement;
}
/**
 * 플러그인 옵션 타입
 */
export interface BasePluginOptions {
    /** 디버그 모드 활성화 */
    debug?: boolean;
    /** 제외할 파일 패턴 */
    exclude?: string[];
    /** 포함할 파일 패턴 */
    include?: string[];
}
/**
 * 파일이 처리 대상인지 확인
 */
export declare function shouldProcessFile(filename: string | null | undefined, options: BasePluginOptions): boolean;
//# sourceMappingURL=utils.d.ts.map