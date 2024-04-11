import {ArchMessageBrokerHandler} from '../types';
import {ArchMessageBrokerChannel} from './message-broker-channel';

export interface ArchMessageBroker {
    getChannel(name: string): ArchMessageBrokerChannel;
    getReplayChannel(name: string): ArchMessageBrokerChannel;
    registerHandler(handler: ArchMessageBrokerHandler): void;
}
