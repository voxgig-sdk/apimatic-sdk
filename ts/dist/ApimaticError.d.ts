import { Context } from './Context';
declare class ApimaticError extends Error {
    isApimaticError: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { ApimaticError };
