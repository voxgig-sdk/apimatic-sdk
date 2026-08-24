import { ApimaticEntityBase } from '../ApimaticEntityBase';
import type { ApimaticSDK } from '../ApimaticSDK';
import type { Control } from '../types';
import type { Transform, TransformCreateData } from '../ApimaticTypes';
declare class TransformEntity extends ApimaticEntityBase<Transform> {
    constructor(client: ApimaticSDK, entopts: any);
    make(this: TransformEntity): TransformEntity;
    create(this: any, reqdata?: TransformCreateData, ctrl?: Control): Promise<TransformEntity>;
}
export { TransformEntity };
