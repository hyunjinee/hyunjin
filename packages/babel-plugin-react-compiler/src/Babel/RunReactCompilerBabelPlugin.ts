import type * as BabelCore from '@babel/core'
import { transformFromAstSync } from '@babel/core'
import * as BabelParser from '@babel/parser'
import invariant from 'invariant'
import type { PluginOptions } from '../EntryPoint'

export function runBabelPluginReactCompiler(
  text: string,
  file: string,
  language: 'flow' | 'typescript',

  options: Partial<PluginOptions> | null,
  includeAst: boolean = false,
) {
  const ast = BabelParser.parse(text, {
    sourceFilename: file,
    plugins: [language, 'jsx'],
    sourceType: 'module',
  })
}
