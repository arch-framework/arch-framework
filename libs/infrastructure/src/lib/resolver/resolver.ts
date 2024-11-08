import {Observable} from 'rxjs';

import {ArchResolver} from '../interfaces/resolver';

export abstract class ArchResolverAbstract<Params extends Array<unknown>, Result> implements ArchResolver<Result> {
    resolve(...params: Params): Observable<Result> {
        return this.processing(...params);
    }

    protected abstract processing(...params: Params): Observable<Result>;
}
