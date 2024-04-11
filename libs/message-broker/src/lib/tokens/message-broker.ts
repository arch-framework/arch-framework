import {ArchMessageBroker} from '../interfaces/message-broker';
import {ArchMessageBrokerChannel} from '../interfaces/message-broker-channel';
import {ArchMessageBrokerHandler} from '../types';

export abstract class ArchMessageBrokerToken implements ArchMessageBroker {
    abstract getChannel(name: string): ArchMessageBrokerChannel;

    abstract getReplayChannel(name: string): ArchMessageBrokerChannel;

    abstract registerHandler(handler: ArchMessageBrokerHandler): void;
}
