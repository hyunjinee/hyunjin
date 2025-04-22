/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RefreshIcon, ShareIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import Logo from './Logo'

export default function Header() {
  const [showCheck, setShowCheck] = useState(false)

  return (
    <div>
      <Logo />
    </div>
  )
}
