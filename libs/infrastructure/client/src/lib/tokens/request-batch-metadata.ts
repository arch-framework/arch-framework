import {HttpContextToken} from '@angular/common/http';

import {RequestBatchMetadata} from '../types';

export const REQUEST_BATCH_METADATA = new HttpContextToken<RequestBatchMetadata | null>(() => null);
