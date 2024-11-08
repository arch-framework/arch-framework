import type {Observable} from 'rxjs';

export function isObservable(obj: any): obj is Observable<unknown> {
    return !!obj && typeof obj.lift === 'function' && typeof obj.subscribe === 'function';
}
