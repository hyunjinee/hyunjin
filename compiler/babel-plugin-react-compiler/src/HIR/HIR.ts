import { z } from 'zod'
import * as t from '@babel/types'
import { Environment } from './Environment'

/*
 * *******************************************************************************************
 * *******************************************************************************************
 * ************************************* Core Data Model *************************************
 * *******************************************************************************************
 * *******************************************************************************************
 */

// AST -> (lowering) -> HIR -> (analysis) -> Reactive Scopes -> (codegen) -> AST

/*
 * A location in a source file, intended to be used for providing diagnostic information and
 * transforming code while preserving source information (ie to emit source maps).
 *
 * `GeneratedSource` indicates that there is no single source location from which the code derives.
 */
export const GeneratedSource = Symbol()
export type SourceLocation = t.SourceLocation | typeof GeneratedSource

/*
 * A React function defines a computation that takes some set of reactive inputs
 * (props, hook arguments) and return a result (JSX, hook return value). Unlike
 * HIR, the data model is tree-shaped:
 *
 * ReactFunction
 *    ReactiveBlock
 *      ReactiveBlockScope*
 *       Place* (dependencies)
 *       (ReactiveInstruction | ReactiveTerminal)*
 *
 * Where ReactiveTerminal may recursively contain zero or more ReactiveBlocks.
 *
 * Each ReactiveBlockScope describes a set of dependencies as well as the instructions (and terminals)
 * within that scope.
 */
export type ReactiveFunction = {
  loc: SourceLocation
  id: string | null
  nameHint: string | null
  params: Array<Place | SpreadPattern>
  generator: boolean
  async: boolean
  body: ReactiveBlock
  env: Environment
  directives: Array<string>
}

export type ReactiveScopeBlock = {
  kind: 'scope'
  scope: ReactiveScope
  instructions: ReactiveBlock
}

export type PrunedReactiveScopeBlock = {
  kind: 'scope'
  scope: ReactiveScope
  instructions: ReactiveBlock
}

export type ReactiveBlock = Array<ReactiveStatement>

export type ReactiveStatement = ReactiveInstructionStatement

export type ReactiveInstructionStatement = {
  kind: 'instruction'
  instruction: ReactiveInstruction
}

export type ReactiveTerminalStatement<Tterminal extends ReactiveTerminal = ReactiveTerminal> = {
  kind: 'terminal'
  terminal: Tterminal
  label: {
    id: BlockId
    implicit: boolean
  } | null
}

export type ReactiveInstruction = {
  id: InstructionId
}

// The effect with which a value is modified.
export enum Effect {
  // Default value: not allowed after lifetime inference
  Unknown = '<unknown>',
  // This reference freezes the value (corresponds to a place where codegen should emit a freeze instruction)
  Freeze = 'freeze',
  // This reference reads the value
  Read = 'read',
  // This reference reads and stores the value
  Capture = 'capture',
  ConditionallyMutateIterator = 'mutate-iterator?',
  /*
   * This reference *may* write to (mutate) the value. This covers two similar cases:
   * - The compiler is being conservative and assuming that a value *may* be mutated
   * - The effect is polymorphic: mutable values may be mutated, non-mutable values
   *   will not be mutated.
   * In both cases, we conservatively assume that mutable values will be mutated.
   * But we do not error if the value is known to be immutable.
   */
  ConditionallyMutate = 'mutate?',

  /*
   * This reference *does* write to (mutate) the value. It is an error (invalid input)
   * if an immutable value flows into a location with this effect.
   */
  Mutate = 'mutate',
  // This reference may alias to (mutate) the value
  Store = 'store',
}
export const EffectSchema = z.enum([
  Effect.Read,
  Effect.Mutate,
  Effect.ConditionallyMutate,
  Effect.ConditionallyMutateIterator,
  Effect.Capture,
  Effect.Store,
  Effect.Freeze,
])

/*
 * Simulated opaque type for IdentifierId to prevent using normal numbers as identifier ids
 * accidentally.
 */
const opaqueIdentifierId = Symbol()
export type IdentifierId = number & { [opaqueIdentifierId]: 'IdentifierId' }

/*
 * Identifier — 변수를 고유하게 식별하는 타입.
 * SSA 형태로 각 정의마다 고유한 id를 부여합니다.
 */
export type Identifier = {
  id: IdentifierId
  name: string | null
}

/*
 * A place where data may be read from / written to:
 * - a variable (identifier)
 * - a path into an identifier
 */
export type Place = {
  kind: 'Identifier'
  identifier: Identifier
  effect: Effect
  loc: SourceLocation
}

/*
 * Simulated opaque type for ScopeIds to prevent using normal numbers as scope ids
 * accidentally.
 */
const opaqueScopeId = Symbol()
export type ScopeId = number & { [opaqueScopeId]: 'ScopeId' }

export type ReactiveScope = {
  id: ScopeId
}

export type SpreadPattern = {
  kind: 'Spread'
  place: Place
}

/*
 * Simulated opaque type for BlockIds to prevent using normal numbers as block ids
 * accidentally.
 */
const opaqueBlockId = Symbol()
export type BlockId = number & { [opaqueBlockId]: 'BlockId' }

/*
 * Simulated opaque type for InstructionId to prevent using normal numbers as ids
 * accidentally.
 */
const opaqueInstructionId = Symbol()
export type InstructionId = number & { [opaqueInstructionId]: 'IdentifierId' }

// placeholder for ReactiveTerminal (used by ReactiveTerminalStatement)
export type ReactiveTerminal = {
  kind: string
}

/*
 * *******************************************************************************************
 * *******************************************************************************************
 * ********************************* CFG (Control Flow Graph) ********************************
 * *******************************************************************************************
 * *******************************************************************************************
 */

/*
 * InstructionValue — 명령어가 계산하는 값의 종류.
 * 최소한의 자바스크립트 구문(로컬 변수, 리터럴, 이항/단항 연산)만 지원합니다.
 */
export type InstructionValue =
  | { kind: 'LoadLocal'; place: Place }
  | { kind: 'StoreLocal'; lvalue: Place; value: Place }
  | { kind: 'Primitive'; value: string | number | boolean | null | undefined }
  | { kind: 'BinaryExpression'; operator: string; left: Place; right: Place }
  | { kind: 'UnaryExpression'; operator: string; value: Place }

/*
 * Instruction — HIR의 기본 실행 단위.
 * 하나의 InstructionValue를 계산하여 lvalue에 저장합니다.
 */
export type Instruction = {
  id: InstructionId
  lvalue: Place
  value: InstructionValue
  loc: SourceLocation
}

/*
 * Terminal — 기본 블록의 마지막에 위치하여 제어 흐름을 결정합니다.
 * - return: 함수에서 값을 반환
 * - goto: 무조건 분기
 * - if: 조건 분기 (consequent/alternate 블록 + fallthrough 합류점)
 * - unsupported: 아직 지원하지 않는 구문
 */
export type Terminal =
  | { kind: 'return'; loc: SourceLocation; value: Place }
  | { kind: 'goto'; block: BlockId }
  | { kind: 'if'; test: Place; consequent: BlockId; alternate: BlockId; fallthrough: BlockId; loc: SourceLocation }
  | { kind: 'unsupported'; loc: SourceLocation }

/*
 * BasicBlock — 제어 흐름 그래프의 노드.
 * 연속된 명령어(instructions)와 하나의 터미널(terminal)로 구성됩니다.
 */
export type BasicBlock = {
  id: BlockId
  kind: 'block' | 'value' | 'loop'
  instructions: Array<Instruction>
  terminal: Terminal
  preds: Set<BlockId>
}

/*
 * HIRFunction — lower 함수의 반환값.
 * 함수 하나를 CFG로 표현합니다.
 */
export type HIRFunction = {
  id: string | null
  params: Array<Place>
  body: {
    entry: BlockId
    blocks: Map<BlockId, BasicBlock>
  }
  async: boolean
  generator: boolean
}
