import {Observable} from 'rxjs';

import {ArchMessageBrokerClientEvent, ArchMessageBrokerClientCommand} from '../types';

export interface ArchMessageBrokerClient<
    T extends Record<string, ArchMessageBrokerClientEvent<unknown> | ArchMessageBrokerClientCommand<unknown, unknown>>,
> {
    emit<K extends keyof T>(
        pattern: T[K] extends ArchMessageBrokerClientEvent<unknown> ? K : never,
        payload: T[K] extends ArchMessageBrokerClientEvent<infer P> ? P : never,
    ): void;

    emit<K extends keyof T>(pattern: T[K] extends ArchMessageBrokerClientEvent<unknown> ? K : never): void;

    send<K extends keyof T>(
        pattern: T[K] extends ArchMessageBrokerClientCommand<unknown, unknown> ? K : never,
        payload: T[K] extends ArchMessageBrokerClientCommand<unknown, infer P> ? P : never,
    ): Observable<T[K][1]>;

    send<K extends keyof T>(
        pattern: T[K] extends ArchMessageBrokerClientCommand<unknown, unknown> ? K : never,
    ): Observable<T[K][1]>;
}
