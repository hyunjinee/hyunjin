declare global {
  let __DEV__: boolean | null | undefined
}

export { runBabelPluginReactCompiler } from './Babel/RunReactCompilerBabelPlugin'

import BabelPluginReactCompiler from './Babel/BabelPlugin'
export default BabelPluginReactCompiler
