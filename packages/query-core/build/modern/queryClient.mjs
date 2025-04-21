// src/queryClient.ts
import { QueryCache } from "./queryCache.js";
import { partialMatchKey } from "./utils.js";
var QueryClient = class {
  #queryCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
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
  isFetching() {
  }
  getQueryData() {
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    let result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        result = { ...result, ...queryDefault.defaultOptions };
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      _defaulted: true
    };
    return defaultedOptions;
  }
  fetchQuery(options) {
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  clear() {
  }
};
export {
  QueryClient
};
//# sourceMappingURL=queryClient.mjs.map