// src/query.ts
import { Removable } from "./removable.js";
var Query = class extends Removable {
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.queryHash = config.queryHash;
  }
  get meta() {
  }
  get promise() {
  }
};
function fetchState(data, options) {
}
export {
  Query,
  fetchState
};
//# sourceMappingURL=query.mjs.map