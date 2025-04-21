import { QueryCache } from './queryCache';
import {
  DefaultedQueryObserverOptions,
  DefaultError,
  DefaultOptions,
  FetchQueryOptions,
  OmitKeyof,
  QueryClientConfig,
  QueryKey,
  QueryObserverOptions,
  QueryOptions,
} from './types';
import { partialMatchKey } from './utils';

// TYPES

interface QueryDefaults {
  queryKey: QueryKey;
  defaultOptions: OmitKeyof<QueryOptions<any, any, any>, 'queryKey'>;
}

interface MutationDefaults {
  // mutationKey: MutationKey;
  // defaultOptions: MutationOptions<any, any, any, any>;
}

export class QueryClient {
  #queryCache: QueryCache;

  #defaultOptions: DefaultOptions;
  #queryDefaults: Map<string, QueryDefaults>;
  #mutationDefaults: Map<string, MutationDefaults>;
  #mountCount: number;
  #unsubscribeFocus?: () => void;
  #unsubscribeOnline?: () => void;

  constructor(config: QueryClientConfig = {}) {
    this.#queryCache = config.queryCache || new QueryCache();

    this.#defaultOptions = config.defaultOptions || {};

    this.#queryDefaults = new Map();
    this.#mutationDefaults = new Map();
    this.#mountCount = 0;
  }

  mount() {
    this.#mountCount++;

    if (this.#mountCount !== 1) {
      return;
    }
  }

  unmount() {
    this.#mountCount--;

    if (this.#mountCount !== 0) {
      return;
    }
  }

  isFetching() {}

  getQueryData<TQueryFnData = unknown, TTaggedQueryKey extends QueryKey = QueryKey>() {}

  getQueryDefaults(queryKey: QueryKey) {
    const defaults = [...this.#queryDefaults.values()];

    let result: OmitKeyof<QueryObserverOptions<any, any, any, any, any>, 'queryKey'> = {};

    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        result = { ...result, ...queryDefault.defaultOptions };
      }
    });
    return result;
  }

  defaultQueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never,
  >(
    options:
      | QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>
      | DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  ): DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    if (options._defaulted) {
      return options as DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
    }

    const defaultedOptions = {
      ...this.#defaultOptions.queries,

      _defaulted: true,
    };

    return defaultedOptions as DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  }

  fetchQuery<TQueryFnData, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(
    options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  ) {}

  getQueryCache(): QueryCache {
    return this.#queryCache;
  }

  getDefaultOptions(): DefaultOptions {
    return this.#defaultOptions;
  }

  clear() {}
}
