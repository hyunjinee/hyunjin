import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

/**
 * 함수를 고수준 중간 표현(HIR)으로 변환합니다.
 *
 * HIR은 코드를 제어 흐름 그래프로 표현합니다.
 * 정밀한 표현식 수준의 메모이제이션을 위해 모든 일반적인 제어 흐름을
 * 가능한 한 정확하게 모델링합니다.
 *
 * 주요 예외 사항은 try/catch 문과 예외 처리입니다:
 * - 현재 try/catch는 컴파일을 건너뛰고(bail out)
 * - 자바스크립트 어디서나 발생할 수 있는 예외의 제어 흐름은 모델링하지 않음
 * - 컴파일러는 예외가 런타임에 의해 처리(메모이제이션 무효화)될 것이라고 가정
 */
export function lower(func: NodePath<t.Function>) {}
