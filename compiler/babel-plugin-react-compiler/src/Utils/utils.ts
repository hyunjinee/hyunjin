/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NodePath } from '@babel/traverse'

export function hasOwnProperty<T>(obj: T, key: string | number | symbol): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
