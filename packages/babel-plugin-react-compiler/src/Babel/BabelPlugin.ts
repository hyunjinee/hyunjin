import type * as BabelCore from '@babel/core'

const ENABLE_REACT_COMPILER_TIMINGS = process.env['ENABLE_REACT_COMPILER_TIMINGS'] === '1'

/*
 * The React Forget Babel Plugin
 * @param {*} _babel
 * @returns
 */
export default function BabelPluginReactCompiler(_bable: typeof BabelCore): BabelCore.PluginObj {
  return {
    name: 'react-forget',
    visitor: {
      Program: {
        enter(prog, pass): void {
          console.log('enter')
        },
        exit(_, pass): void {
          console.log('exit')
          if (ENABLE_REACT_COMPILER_TIMINGS === true) {
          }
        },
      },
    },
  }
}
