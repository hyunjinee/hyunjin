import { Query } from './query';
import { QueryClient } from './queryClient';

// TYPES
type TransformerFn = (data: any) => any;
function defaultTransformerFn(data: any): any {
  return data;
}

// FUNCTIONS
function dehydrateMutation() {}

// Most config is not dehydrated but instead meant to configure again when
// consuming the de/rehydrated data, typically with useQuery on the client.
// Sometimes it might make sense to prefetch data on the server and include
// in the html-payload, but not consume it on the initial render.
function dehydrateQuery(query: Query, serializeData: TransformerFn) {
  return {
    state: {},
  };
}

export function hydrate(client: QueryClient, dehydratedState: unknown) {}
