"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/queryClient.ts
var queryClient_exports = {};
__export(queryClient_exports, {
  QueryClient: () => QueryClient
});
module.exports = __toCommonJS(queryClient_exports);
var import_queryCache = require("./queryCache.cjs");
var import_utils = require("./utils.cjs");
var QueryClient = class {
  #queryCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new import_queryCache.QueryCache();
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
      if ((0, import_utils.partialMatchKey)(queryKey, queryDefault.queryKey)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryClient
});
//# sourceMappingURL=queryClient.js.map