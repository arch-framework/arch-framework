import {Observable} from 'rxjs';

export interface ArchResolver<T> {
    resolve(...params: unknown[]): Observable<T>;
}
