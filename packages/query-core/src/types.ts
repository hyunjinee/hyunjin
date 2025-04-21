import { Query } from './query';
import { QueryCache } from './queryCache';

export type OmitKeyof<
  TObject,
  TKey extends TStrictly extends 'safely'
    ?
        | keyof TObject
        | (string & Record<never, never>)
        | (number & Record<never, never>)
        | (symbol & Record<never, never>)
    : keyof TObject,
  TStrictly extends 'strictly' | 'safely' = 'strictly',
> = Omit<TObject, TKey>;

export type QueryKey = ReadonlyArray<unknown>;
export type MutationKey = ReadonlyArray<unknown>;

export interface Register {
  // defaultError: Error
  // queryMeta: Record<string, unknown>
  // mutationMeta: Record<string, unknown>
}

export type DefaultError = Register extends {
  defaultError: infer TError;
}
  ? TError
  : Error;

export interface QueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> {
  /**
   * The time in milliseconds that unused/inactive cache data remains in memory.
   * When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration.
   * When different garbage collection times are specified, the longest one will be used.
   * Setting it to `Infinity` will disable garbage collection.
   */
  gcTime?: number;

  queryHash?: string;
  queryKey?: TQueryKey;
  queryKeyHashFn?: QueryKeyHashFunction<TQueryKey>;
  initialData?: TData | InitialDataFunction<TData>;
  initialDataUpdatedAt?: number | (() => number | undefined);

  _defaulted?: boolean;

  /**
   * Maximum number of pages to store in the data of an infinite query.
   */
  maxPages?: number;
}

export interface CancelOptions {
  revert?: boolean;
  silent?: boolean;
}

export interface QueryClientConfig {
  queryCache?: QueryCache;
  // mutationCache?: MutationCache;
  defaultOptions?: DefaultOptions;
}

export interface DefaultOptions<TError = DefaultError> {
  queries?: OmitKeyof<QueryObserverOptions<unknown, TError>, 'suspense' | 'queryKey'>;
}

export interface SetDataOptions {
  updatedAt?: number;
}

export type NotifyEventType =
  | 'added'
  | 'removed'
  | 'updated'
  | 'observerAdded'
  | 'observerRemoved'
  | 'observerResultsUpdated'
  | 'observerOptionsUpdated';

export interface NotifyEvent {
  type: NotifyEventType;
}

export type QueryKeyHashFunction<TQueryKey extends QueryKey> = (queryKey: TQueryKey) => string;

export type InitialDataFunction<T> = () => T | undefined;

export type WithRequired<TTarget, TKey extends keyof TTarget> = TTarget & {
  [_ in TKey]: {};
};

export type QueryStatus = 'pending' | 'error' | 'success';
export type FetchStatus = 'fetching' | 'paused' | 'idle';

export type StaleTime<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = number | ((query: Query<TQueryFnData, TError, TData, TQueryKey>) => number);

export type Enabled<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = boolean | ((query: Query<TQueryFnData, TError, TData, TQueryKey>) => boolean);

export interface FetchQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> extends WithRequired<QueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, 'queryKey'> {
  /**
   * The time in milliseconds after data is considered stale.
   * If the data is fresh it will be returned from the cache.
   */
  staleTime?: StaleTime<TQueryFnData, TError, TData, TQueryKey>;
}

export type DefaultedQueryObserverOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = WithRequired<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'throwOnError' | 'refetchOnReconnect' | 'queryHash'
>;

export type ThrowOnError<TQueryFnData, TError, TQueryData, TQueryKey extends QueryKey> =
  | boolean
  | ((error: TError, query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean);

export interface QueryObserverOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> extends WithRequired<QueryOptions<TQueryFnData, TError, TQueryData, TQueryKey, TPageParam>, 'queryKey'> {
  /**
   * Set this to `false` or a function that returns `false` to disable automatic refetching when the query mounts or changes query keys.
   * To refetch the query, use the `refetch` method returned from the `useQuery` instance.
   * Accepts a boolean or function that returns a boolean.
   * Defaults to `true`.
   */
  enabled?: Enabled<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * The time in milliseconds after data is considered stale.
   * If set to `Infinity`, the data will never be considered stale.
   * If set to a function, the function will be executed with the query to compute a `staleTime`.
   */
  staleTime?: StaleTime<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * If set to a number, the query will continuously refetch at this frequency in milliseconds.
   * If set to a function, the function will be executed with the latest data and query to compute a frequency
   * Defaults to `false`.
   */
  refetchInterval?:
    | number
    | false
    | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => number | false | undefined);
  /**
   * If set to `true`, the query will continue to refetch while their tab/window is in the background.
   * Defaults to `false`.
   */
  refetchIntervalInBackground?: boolean;
  /**
   * If set to `true`, the query will refetch on window focus if the data is stale.
   * If set to `false`, the query will not refetch on window focus.
   * If set to `'always'`, the query will always refetch on window focus.
   * If set to a function, the function will be executed with the latest data and query to compute the value.
   * Defaults to `true`.
   */
  refetchOnWindowFocus?:
    | boolean
    | 'always'
    | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always');
  /**
   * If set to `true`, the query will refetch on reconnect if the data is stale.
   * If set to `false`, the query will not refetch on reconnect.
   * If set to `'always'`, the query will always refetch on reconnect.
   * If set to a function, the function will be executed with the latest data and query to compute the value.
   * Defaults to the value of `networkOnline` (`true`)
   */
  refetchOnReconnect?:
    | boolean
    | 'always'
    | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always');
  /**
   * If set to `true`, the query will refetch on mount if the data is stale.
   * If set to `false`, will disable additional instances of a query to trigger background refetch.
   * If set to `'always'`, the query will always refetch on mount.
   * If set to a function, the function will be executed with the latest data and query to compute the value
   * Defaults to `true`.
   */
  refetchOnMount?:
    | boolean
    | 'always'
    | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always');
  /**
   * If set to `false`, the query will not be retried on mount if it contains an error.
   * Defaults to `true`.
   */
  retryOnMount?: boolean;
  /**
   * If set, the component will only re-render if any of the listed properties change.
   * When set to `['data', 'error']`, the component will only re-render when the `data` or `error` properties change.
   * When set to `'all'`, the component will re-render whenever a query is updated.
   * When set to a function, the function will be executed to compute the list of properties.
   * By default, access to properties will be tracked, and the component will only re-render when one of the tracked properties change.
   */
  notifyOnChangeProps?: NotifyOnChangeProps;
  /**
   * Whether errors should be thrown instead of setting the `error` property.
   * If set to `true` or `suspense` is `true`, all errors will be thrown to the error boundary.
   * If set to `false` and `suspense` is `false`, errors are returned as state.
   * If set to a function, it will be passed the error and the query, and it should return a boolean indicating whether to show the error in an error boundary (`true`) or return the error as state (`false`).
   * Defaults to `false`.
   */
  throwOnError?: ThrowOnError<TQueryFnData, TError, TQueryData, TQueryKey>;

  _optimisticResults?: 'optimistic' | 'isRestoring';
}

export type NetworkMode = 'online' | 'always' | 'offlineFirst';
