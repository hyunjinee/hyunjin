import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import prettyFormat from 'pretty-format'

function run() {}

function runWithEnvironment(
  func: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>,
  env: Environment,
) {}

export function compileFn(func: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>) {
  return run()
}
