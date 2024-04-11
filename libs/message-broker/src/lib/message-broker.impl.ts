import {Inject, Injectable} from '@angular/core';

import {map, switchMap, tap} from 'rxjs';

import {ArchMessageBrokerCommandHandler, ArchMessageBrokerEventHandler} from './interfaces/message-broker-handler';
import {ArchMessageBrokerEvent} from './interfaces/message-broker-event';
import {ArchMessageBrokerToken} from './tokens/message-broker';
import {ArchMessageBrokerChannel} from './interfaces/message-broker-channel';
import {ArchMessageBrokerChannelImpl} from './message-broker-channel.impl';
import {ArchMessageBrokerTransportToken} from './tokens/message-broker-transport';
import {ArchMessageBrokerTransport} from './interfaces/message-broker-transport';
import {ArchMessageBrokerHandler, ArchMessageBrokerHandlerKind, ArchMessageBrokerHandlerParams} from './types';
import {ARCH_HANDLER_KIND, ARCH_HANDLER_METADATA} from './constants';
import {ArchMessageBrokerEventImpl} from './message-broker-event.impl';

@Injectable()
export class ArchMessageBrokerImpl extends ArchMessageBrokerToken {
    private readonly channels = new Map<string, ArchMessageBrokerChannel>();

    private readonly handlers = new Set<object | null>();

    constructor(@Inject(ArchMessageBrokerTransportToken) private readonly transport: ArchMessageBrokerTransport) {
        super();
    }

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
                this.#registerEventHandler(handler as ArchMessageBrokerEventHandler<unknown>);
                break;
            }
            case ArchMessageBrokerHandlerKind.Command: {
                this.#registerCommandHandler(handler as ArchMessageBrokerCommandHandler<unknown, unknown>);
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

    #registerEventHandler(handler: ArchMessageBrokerEventHandler<unknown>): void {
        const {channel, pattern}: ArchMessageBrokerHandlerParams = Reflect.getMetadata(ARCH_HANDLER_METADATA, handler);
        const to = this.getChannel(channel);

        to.on(pattern)
            .pipe(tap(event => handler.handle(event)))
            .subscribe();
    }

    #registerCommandHandler(handler: ArchMessageBrokerCommandHandler<unknown, unknown>): void {
        const {channel, pattern}: ArchMessageBrokerHandlerParams = Reflect.getMetadata(ARCH_HANDLER_METADATA, handler);
        const to = this.getChannel(channel);
        const from = this.getReplayChannel(channel);

        to.on(pattern)
            .pipe(
                switchMap(event =>
                    handler
                        .handle(event)
                        .pipe(map(result => [event, result] as [ArchMessageBrokerEvent<unknown>, unknown])),
                ),
                map(([event, result]) => {
                    const {id} = event.getMetadata();
                    const channel = from.getChannelName();

                    return new ArchMessageBrokerEventImpl(result, {id, pattern, channel});
                }),
                tap(event => from.emit(event)),
            )
            .subscribe();
    }
}
