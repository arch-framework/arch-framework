export class ArchMessageBrokerHandlerNoMetadataError extends Error {
    constructor() {
        super(
            'Message broker event handler is not have metadata. Add ArchEventPattern or ArchMessagePattern decorator to handler',
        );
    }
}
