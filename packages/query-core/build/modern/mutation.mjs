// src/mutation.ts
import { Removable } from "./removable.js";
var Mutation = class extends Removable {
  constructor() {
    super();
  }
  optionalRemove() {
    throw new Error("Method not implemented.");
  }
};
export {
  Mutation
};
//# sourceMappingURL=mutation.mjs.map