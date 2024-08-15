import {Observable} from 'rxjs';

import {ArchView} from './view';

export interface ArchUseCase<P, T extends ArchView | void> {
    execute(params: P): Observable<T>;
}
