import {filter, map, Observable} from 'rxjs';

import {ArchIdGenerator} from '@ng-arch/common';

import {ArchMessageBrokerClient} from './interfaces/message-broker-client';
import {ArchMessageBroker} from './interfaces/message-broker';
import {ArchMessageBrokerClientEvent, ArchMessageBrokerClientCommand} from './types';
import {ArchMessageBrokerEventImpl} from './message-broker-event.impl';

export class ArchMessageBrokerClientImpl<
    T extends Record<string, ArchMessageBrokerClientEvent | ArchMessageBrokerClientCommand<unknown>>,
> implements ArchMessageBrokerClient<T>
{
    constructor(
        private readonly channel: string,
        private readonly broker: ArchMessageBroker,
        private readonly generator: ArchIdGenerator,
    ) {}

    emit<K extends keyof T>(
        pattern: T[K] extends ArchMessageBrokerClientEvent ? K : never,
        payload: T[K] extends ArchMessageBrokerClientEvent<infer P> ? P : never,
    ): void;
    emit<K extends keyof T>(pattern: T[K] extends ArchMessageBrokerClientEvent ? K : never): void;
    emit(pattern: string, payload?: unknown): void {
        const id = this.generator.generateId();
        const to = this.broker.getChannel(this.channel);
        const event = new ArchMessageBrokerEventImpl(payload, {
            id,
            pattern,
            channel: this.channel,
        });

        to.emit(event);
    }

    send<K extends keyof T>(
        pattern: T[K] extends ArchMessageBrokerClientCommand<unknown> ? K : never,
        payload: T[K] extends ArchMessageBrokerClientCommand<unknown, infer P> ? P : never,
    ): Observable<T[K][1]>;
    send<K extends keyof T>(
        pattern: T[K] extends ArchMessageBrokerClientCommand<unknown> ? K : never,
    ): Observable<T[K][1]>;
    send<K extends keyof T>(pattern: string, payload?: unknown): Observable<T[K][1]> {
        const id = this.generator.generateId();
        const to = this.broker.getChannel(this.channel);
        const from = this.broker.getReplayChannel(this.channel);
        const event = new ArchMessageBrokerEventImpl(payload, {
            id,
            pattern,
            channel: this.channel,
        });

        to.emit(event);

        return from.on(pattern).pipe(
            filter(event => {
                const metadata = event.getMetadata();

                return metadata.id === id && metadata.pattern === pattern;
            }),
            map(event => event.getPayload()),
        );
    }
}
