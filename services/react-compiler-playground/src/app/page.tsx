/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client'

import { SnackbarProvider } from 'notistack'
import React from 'react'
import { StoreProvider } from '../components'
import Editor from '../components/EditorImpl'
import Header from '../components/Header'

export default function page() {
  return (
    <StoreProvider>
      <SnackbarProvider>
        <Header />
        <Editor />
      </SnackbarProvider>
    </StoreProvider>
  )
}
