import { NodePath } from '@babel/core'
import * as t from '@babel/types'

export type SuppressionRange = {
  disableComment: t.Comment
  enableComment: t.Comment | null
  source: SuppressionSource
}

type SuppressionSource = 'Eslint' | 'Flow'
