import * as React from 'react'

const { useRef, useEffect, useState } = React

const ReactSecretInternals =
  //@ts-ignore
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
  //@ts-ignore
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

type MemoCache = Array<number | typeof $empty>

const $empty = Symbol.for('react.memo_cache_sentinel')

enum GuardKind {
  PushGuardContext = 0,
}

// Re-export React.c if present, otherwise fallback to the userspace polyfill for versions of React
// < 19.
export const c =
  typeof React.__COMPILER_RUNTIME?.c === 'function'
    ? React.__COMPILER_RUNTIME.c
    : function c(size: number) {
        return React.useMemo<Array<unknown>>(() => {
          const $ = new Array(size)
          for (let ii = 0; ii < size; ii++) {
            $[ii] = $empty
          }
          // This symbol is added to tell the react devtools that this array is from
          // useMemoCache.
          // @ts-ignore
          $[$empty] = true
          return $
        }, [])
      }
