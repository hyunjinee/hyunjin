// src/queryObserver.ts
import { Subscribable } from "./subscribable.js";
var QueryObserver = class extends Subscribable {
  #client;
  constructor(client) {
    this.#client = client;
  }
};
export {
  QueryObserver
};
//# sourceMappingURL=queryObserver.mjs.map