import {InjectionToken} from '@angular/core';

import {RequestJsonRpcBatch} from '../classes/request-json-rpc-batch';

export const REQUEST_BATCH_MAP = new InjectionToken<Map<string, RequestJsonRpcBatch>>('REQUEST_BATCH_MAP');
