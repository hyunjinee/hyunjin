import type * as BabelCore from '@babel/core'
import { transformFromAstSync } from '@babel/core'
import * as BabelParser from '@babel/parser'
import invariant from 'invariant'
import type { PluginOptions } from '../EntryPoint'
import BabelPluginReactCompiler from './BabelPlugin'

export function runBabelPluginReactCompiler(
  text: string,
  file: string,
  language: 'flow' | 'typescript',
  options: Partial<PluginOptions> | null,
  includeAst: boolean = false,
): BabelCore.BabelFileResult {
  const ast = BabelParser.parse(text, {
    sourceFilename: file,
    plugins: [language, 'jsx'],
    sourceType: 'module',
  })

  const result = transformFromAstSync(ast as any, text, {
    ast: includeAst,
    filename: file,
    highlightCode: false,
    retainLines: true,
    plugins: [[BabelPluginReactCompiler, options], 'babel-plugin-fbt', 'babel-plugin-fbt-runtime'],
    sourceType: 'module',
    configFile: false,
    babelrc: false,
  })

  invariant(result?.code != null, `Expected BabelPluginReactForget to codegen successfully, got: ${result}`)

  return result
}
