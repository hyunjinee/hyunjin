// src/queryCache.ts
import { Subscribable } from "./subscribable.js";
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
  }
};
export {
  QueryCache
};
//# sourceMappingURL=queryCache.mjs.map