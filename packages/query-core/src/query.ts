import { QueryCache } from './queryCache';
import { QueryObserver } from './queryObserver';
import { Removable } from './removable';
import { Retryer } from './retryer';
import { DefaultError, FetchStatus, InitialDataFunction, QueryKey, QueryOptions, QueryStatus } from './types';
import { isServer } from './utils';

interface QueryConfig<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey> {
  cache: QueryCache;
  queryKey: TQueryKey;
  queryHash: string;
  options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  defaultOptions?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  state?: QueryState<TData, TError>;
}

export interface QueryState<TData = unknown, TError = DefaultError> {
  data: TData | undefined;
  dataUpdateCount: number;
  dataUpdatedAt: number;
  error: TError | null;
  errorUpdateCount: number;
  errorUpdatedAt: number;
  fetchFailureCount: number;
  fetchFailureReason: TError | null;
  fetchMeta: FetchMeta | null;
  isInvalidated: boolean;
  status: QueryStatus;
  fetchStatus: FetchStatus;
}

export interface FetchContext<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey> {
  fetchFn: () => unknown | Promise<unknown>;
  fetchOptions?: FetchOptions;
  signal: AbortSignal;
  options: QueryOptions<TQueryFnData, TError, TData, any>;
  queryKey: TQueryKey;
  state: QueryState<TData, TError>;
}

export type FetchDirection = 'forward' | 'backward';

export interface FetchMeta {
  fetchMore?: { direction: FetchDirection };
}

export interface FetchOptions<TData = unknown> {
  cancelRefetch?: boolean;
  meta?: FetchMeta;
  initialPromise?: Promise<TData>;
}

interface FailedAction<TError> {
  type: 'failed';
  failureCount: number;
  error: TError;
}

interface FetchAction {
  type: 'fetch';
  meta?: FetchMeta;
}

interface SuccessAction<TData> {
  data: TData | undefined;
  type: 'success';
  dataUpdatedAt?: number;
  manual?: boolean;
}

interface ErrorAction<TError> {
  type: 'error';
  error: TError;
}

interface InvalidateAction {
  type: 'invalidate';
}

interface PauseAction {
  type: 'pause';
}

interface ContinueAction {
  type: 'continue';
}

interface SetStateAction<TData, TError> {
  type: 'setState';
  state: Partial<QueryState<TData, TError>>;
  setStateOptions?: SetStateOptions;
}

export type Action<TData, TError> =
  | ContinueAction
  | ErrorAction<TError>
  | FailedAction<TError>
  | FetchAction
  | InvalidateAction
  | PauseAction
  | SetStateAction<TData, TError>
  | SuccessAction<TData>;

export interface SetStateOptions {
  meta?: any;
}

// CLASS

export class Query<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Removable {
  queryKey: TQueryKey;
  queryHash: string;
  options!: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  state: QueryState<TData, TError>;
  isFetchingOptimistic?: boolean;

  #initialState: QueryState<TData, TError>;
  #revertState?: QueryState<TData, TError>;
  #cache: QueryCache;
  #retryer?: Retryer<TData>;
  observers: Array<QueryObserver<any, any, any, any, any>>;
  #defaultOptions?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  #abortSignalConsumed: boolean;

  constructor(config: QueryConfig<TQueryFnData, TError, TData, TQueryKey>) {
    super();

    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#cache = config.cache;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }

  get meta() {}

  get promise() {}

  setOptions(options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    this.options = { ...this.#defaultOptions, ...options };

    this.updateGcTime(this.options.gcTime);
  }
}

export function fetchState<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(
  data: TData | undefined,
  options: QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {}

function getDefaultState<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(
  options: QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): QueryState<TData, TError> {
  const data =
    typeof options.initialData === 'function'
      ? (options.initialData as InitialDataFunction<TData>)()
      : options.initialData;

  const hasData = data !== undefined;

  const initialDataUpdatedAt = hasData
    ? typeof options.initialDataUpdatedAt === 'function'
      ? (options.initialDataUpdatedAt as () => number | undefined)()
      : options.initialDataUpdatedAt
    : 0;

  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? (initialDataUpdatedAt ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? 'success' : 'pending',
    fetchStatus: 'idle',
  };
}
