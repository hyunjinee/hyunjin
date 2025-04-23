/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import clsx from 'clsx'
import { RefreshIcon, ShareIcon } from '@heroicons/react/outline'
import { CheckIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import Logo from './Logo'
import { useSnackbar } from 'notistack'
import { useStoreDispatch } from './StoreContext'
import { defaultStore } from '../lib/defaultStore'

export default function Header() {
  const [showCheck, setShowCheck] = useState(false)
  const dispatchStore = useStoreDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleReset: () => void = () => {
    if (confirm('Are you sure you want to reset the playground?')) {
      /**
       * Close open snackbars if any. This is necessary because when displaying
       * outputs (Preview or not), we only close previous snackbars if we received
       * new messages, which is needed in order to display "Bad URL" or success
       * messages when loading Playground for the first time. Otherwise, messages
       * such as "Bad URL" will be closed by the outputs calling `closeSnackbar`.
       */
      closeSnackbar()
      dispatchStore({ type: 'setStore', payload: { store: defaultStore } })
    }
  }

  const handleShare: () => void = () => {
    navigator.clipboard.writeText(location.href).then(() => {
      enqueueSnackbar('URL copied to clipboard')
      setShowCheck(true)
      // Show the check mark icon briefly after URL is copied
      setTimeout(() => setShowCheck(false), 1000)
    })
  }

  return (
    <div className="fixed z-10 flex items-center justify-between w-screen px-5 py-3 bg-white border-b border-gray-200 h-14">
      <div className="flex items-center flex-none h-full gap-2 text-lg">
        <Logo className={clsx('w-8 h-8 text-link', process.env.NODE_ENV === 'development' && 'text-yellow-600')} />
        <p className="hidden select-none sm:block">React Compiler Playground</p>
      </div>
    </div>
  )
}
