import {Observable} from 'rxjs';

export interface ArchResource<RequestParams, ResponseData> {
    request(params: RequestParams): Observable<ResponseData>;
}
