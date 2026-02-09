import invariant from 'invariant'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { defaultStore } from '../defaultStore'

/**
 * Global Store for Playground
 */
export interface Store {
  source: string
}

export function encodeStore(store: Store): string {
  return compressToEncodedURIComponent(JSON.stringify(store))
}
export function decodeStore(hash: string): Store {
  return JSON.parse(decompressFromEncodedURIComponent(hash))
}

export function saveStore(store: Store): void {
  const hash = encodeStore(store)
  localStorage.setItem('playgroundStore', hash)
  history.replaceState({}, '', `#${hash}`)
}
