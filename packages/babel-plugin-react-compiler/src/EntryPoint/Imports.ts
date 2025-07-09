import { NodePath } from '@babel/core'
import * as t from '@babel/types'
import { Scope as BabelScope } from '@babel/traverse'
import { CompilerReactTarget, PluginOptions } from './Options'
import { SuppressionRange } from './Suppression'
import { CompilerError } from '../CompileError'
import { isHookName } from '../HIR/Environment'

type ProgramContextOptions = {
  program: NodePath<t.Program>
  suppressions: Array<SuppressionRange>
  opts: PluginOptions
  filename: string | null
  code: string | null
  hasModuleScopeOptOut: boolean
}

export class ProgramContext {
  /**
   * Program and environment context
   */
  scope: BabelScope
  opts: PluginOptions
  filename: string | null
  code: string | null
  reactRuntimeModule: string
  suppressions: Array<SuppressionRange>
  hasModuleScopeOptOut: boolean

  constructor({ program, opts, filename, code, hasModuleScopeOptOut, suppressions }: ProgramContextOptions) {
    this.scope = program.scope
    this.opts = opts
    this.filename = filename
    this.code = code
    this.reactRuntimeModule = getReactCompilerRuntimeModule(opts.target)
    this.suppressions = suppressions
    this.hasModuleScopeOptOut = hasModuleScopeOptOut
  }

  // isHookName(name: string): boolean {
  //   if (this.opts.environment.hookPattern == null) {
  //     return isHookName(name)
  //   } else {
  //     const match = new RegExp(this.opts.environment.hookPattern).exec(name)
  //     return match != null && typeof match[1] === 'string' && isHookName(match[1])
  //   }
  // }

  isHookName(name: string): boolean {
    // if (this.o)

    return isHookName(name)
  }
}

export function getReactCompilerRuntimeModule(target: CompilerReactTarget): string {
  if (target === '19') {
    return 'react/compiler-runtime' // from react namespace
  } else if (target === '17' || target === '18') {
    return 'react-compiler-runtime' // npm package
  } else {
    // CompilerError.invariant(
    //   target != null && target.kind === 'donotuse_meta_internal' && typeof target.runtimeModule === 'string',
    //   {
    //     reason: 'Expected target to already be validated',
    //     description: null,
    //     loc: null,
    //     suggestions: null,
    //   },
    // )
    return target.runtimeModule
  }
}
