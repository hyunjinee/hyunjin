// src/retryer.ts
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function isCancelledError(value) {
  return value instanceof CancelledError;
}
export {
  CancelledError,
  isCancelledError
};
//# sourceMappingURL=retryer.mjs.map