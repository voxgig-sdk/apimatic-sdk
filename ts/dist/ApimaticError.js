"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApimaticError = void 0;
class ApimaticError extends Error {
    isApimaticError = true;
    sdk = 'Apimatic';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.ApimaticError = ApimaticError;
//# sourceMappingURL=ApimaticError.js.map