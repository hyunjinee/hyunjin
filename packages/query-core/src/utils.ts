import { Query } from './query';
import { FetchStatus, MutationKey, QueryKey, QueryOptions } from './types';

// TYPES
export interface QueryFilters {
  /**
   * Filter to active queries, inactive queries or all queries
   */
  type?: QueryTypeFilter;
  /**
   * Match query key exactly
   */
  exact?: boolean;
  /**
   * Include queries matching this predicate function
   */
  predicate?: (query: Query) => boolean;
  /**
   * Include queries matching this query key
   */
  queryKey?: QueryKey;
  /**
   * Include or exclude stale queries
   */
  stale?: boolean;
  /**
   * Include queries matching their fetchStatus
   */
  fetchStatus?: FetchStatus;
}

export type QueryTypeFilter = 'all' | 'active' | 'inactive';

// UTILS

export function isValidTimeout(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && value !== Infinity;
}
export const isServer = typeof window === 'undefined' || 'Deno' in globalThis;

// Copied from: https://github.com/jonschlinkert/is-plain-object
export function isPlainObject(o: any): o is Object {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has no constructor
  const ctor = o.constructor;
  if (ctor === undefined) {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Handles Objects created by Object.create(<arbitrary prototype>)
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function hasObjectPrototype(o: any): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export function hashQueryKeyByOptions<TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  options?: Pick<QueryOptions<any, any, any, any>, 'queryKeyHashFn'>,
) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}

/**
 * Default query & mutation keys hash function.
 * Hashes the value into a stable hash.
 */
export function hashKey(queryKey: QueryKey | MutationKey): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {} as any)
      : val,
  );
}

/**
 * Checks if key `b` partially matches with key `a`.
 */
export function partialMatchKey(a: QueryKey, b: QueryKey): boolean;
export function partialMatchKey(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some((key) => !partialMatchKey(a[key], b[key]));
  }

  return false;
}

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
