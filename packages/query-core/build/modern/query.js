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

// src/query.ts
var query_exports = {};
__export(query_exports, {
  Query: () => Query,
  fetchState: () => fetchState
});
module.exports = __toCommonJS(query_exports);
var import_removable = require("./removable.cjs");
var Query = class extends import_removable.Removable {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Query,
  fetchState
});
//# sourceMappingURL=query.js.map