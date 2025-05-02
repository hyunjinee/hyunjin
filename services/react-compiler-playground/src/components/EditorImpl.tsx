import React from 'react'
import { useStore, useStoreDispatch } from './StoreContext'
import { useDeferredValue } from 'react'
import { useSnackbar } from 'notistack'

function parseInput() {}

export default function Editor() {
  const store = useStore()
  const deferredStore = useDeferredValue(store)
  const dispatchStore = useStoreDispatch()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <>
      <div>
        <div></div>
      </div>
    </>
  )
}

function compile() {}
