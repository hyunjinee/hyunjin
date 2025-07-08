import type * as BabelCore from '@babel/core'
import { compileProgram } from '../EntryPoint/Program'
// import { compileProgram, Logger, parsePluginOptions } from '../Entrypoint'
// import { injectReanimatedFlag, pipelineUsesReanimatedPlugin } from '../Entrypoint/Reanimated'
// import validateNoUntransformedReferences from '../Entrypoint/ValidateNoUntransformedReferences'

const ENABLE_REACT_COMPILER_TIMINGS = process.env['ENABLE_REACT_COMPILER_TIMINGS'] === '1'

/*
 * The React Forget Babel Plugin
 * @param {*} _babel
 * @returns
 */
export default function BabelPluginReactCompiler(_babel: typeof BabelCore): BabelCore.PluginObj {
  return {
    name: 'react-forget',
    visitor: {
      Program: {
        /*
         * Note: Babel does some "smart" merging of visitors across plugins, so even if A is inserted
         * prior to B, if A does not have a Program visitor and B does, B will run first. We always
         * want Forget to run true to source as possible.
         */
        enter(prog, pass) {
          let opts = parsePluginOptions(pass.opts)

          const result = compileProgram(prog, {
            opts,
            filename: pass.filename ?? null,
            comments: pass.file.ast.comments ?? [],
            code: pass.file.code,
          })
          // const { opts } = state.file.opts
        },
        exit(path, state) {
          // const { opts } = state.file.opts
        },
      },
    },
  }
}
