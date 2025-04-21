import { QueryClient } from './queryClient';
import { Subscribable } from './subscribable';
import { DefaultError } from './types';

type QueryObserverListener<TData, TError> = (result: QueryObserverResult<TData, TError>) => void;

export class QueryObserver<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Subscribable<QueryObserverListener<TData, TError>> {
  #client: QueryClient;

  constructor(client: QueryClient) {
    this.#client = client;
  }
}
