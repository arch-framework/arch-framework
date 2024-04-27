import {inject, Injectable} from '@angular/core';

import {map, switchMap, take, tap} from 'rxjs';

import {ArchMessageBrokerHandlerCommand, ArchMessageBrokerHandlerEvent} from './interfaces/message-broker-handler';
import {ArchMessageBrokerEvent} from './interfaces/message-broker-event';
import {ArchMessageBrokerChannel} from './interfaces/message-broker-channel';
import {ArchMessageBrokerTransport} from './interfaces/message-broker-transport';
import {ArchMessageBrokerToken} from './tokens/message-broker';
import {ArchMessageBrokerTransportToken} from './tokens/message-broker-transport';
import {ArchMessageBrokerChannelImpl} from './message-broker-channel.impl';
import {ArchMessageBrokerEventImpl} from './message-broker-event.impl';
import {ArchMessageBrokerHandler, ArchMessageBrokerHandlerKind, ArchMessageBrokerHandlerParams} from './types';
import {ARCH_HANDLER_CHANNEL, ARCH_HANDLER_KIND, ARCH_HANDLER_METADATA} from './constants';

@Injectable()
export class ArchMessageBrokerImpl extends ArchMessageBrokerToken {
    private readonly channels = new Map<string, ArchMessageBrokerChannel>();

    private readonly handlers = new Set<object | null>();

    private readonly transport = inject<ArchMessageBrokerTransport>(ArchMessageBrokerTransportToken);

    getChannel(name: string): ArchMessageBrokerChannel {
        return this.#getChannel(name);
    }

    getReplayChannel(name: string): ArchMessageBrokerChannel {
        return this.#getChannel(`${name}_replay`);
    }

    registerHandler(handler: ArchMessageBrokerHandler): void {
        const kind = Reflect.getMetadata(ARCH_HANDLER_KIND, handler) as ArchMessageBrokerHandlerKind;
        const prototype = Reflect.getPrototypeOf(handler);

        if (this.handlers.has(prototype)) {
            return undefined;
        }

        switch (kind) {
            case ArchMessageBrokerHandlerKind.Event: {
                this.#registerEventHandler(handler as ArchMessageBrokerHandlerEvent<unknown>);
                break;
            }
            case ArchMessageBrokerHandlerKind.Command: {
                this.#registerCommandHandler(handler as ArchMessageBrokerHandlerCommand<unknown, unknown>);
                break;
            }
        }

        this.handlers.add(prototype);
    }

    #getChannel(name: string): ArchMessageBrokerChannel {
        if (this.channels.has(name)) {
            return this.channels.get(name) as ArchMessageBrokerChannel;
        } else {
            const channel = new ArchMessageBrokerChannelImpl(name, this.transport);

            this.channels.set(name, channel);

            return channel;
        }
    }

    #registerEventHandler(handler: ArchMessageBrokerHandlerEvent<unknown>): void {
        const channel: string = Reflect.getMetadata(ARCH_HANDLER_CHANNEL, handler);
        const {pattern}: ArchMessageBrokerHandlerParams = Reflect.getMetadata(ARCH_HANDLER_METADATA, handler);
        const from = this.getChannel(channel);

        from.on(pattern)
            .pipe(switchMap(event => handler.handle(event).pipe(take(1))))
            .subscribe();
    }

    #registerCommandHandler(handler: ArchMessageBrokerHandlerCommand<unknown, unknown>): void {
        const channel: string = Reflect.getMetadata(ARCH_HANDLER_CHANNEL, handler);
        const {pattern}: ArchMessageBrokerHandlerParams = Reflect.getMetadata(ARCH_HANDLER_METADATA, handler);
        const from = this.getChannel(channel);
        const to = this.getReplayChannel(channel);

        from.on(pattern)
            .pipe(
                switchMap(event =>
                    handler.handle(event).pipe(
                        take(1),
                        map(result => [event, result] as [ArchMessageBrokerEvent<unknown>, unknown]),
                    ),
                ),
                map(([event, result]) => {
                    const {id} = event.getMetadata();
                    const channel = to.getChannelName();

                    return new ArchMessageBrokerEventImpl(result, {id, pattern, channel});
                }),
                tap(event => to.emit(event)),
            )
            .subscribe();
    }
}
