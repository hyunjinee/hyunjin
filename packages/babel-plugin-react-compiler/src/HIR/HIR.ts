import { z } from 'zod'
import * as t from '@babel/types'

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
  params: Array<Place | SpreadPattern>
  generator: boolean
  async: boolean
  body: ReactiveBlock
  env: Environment
  directives: Array<string>
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
