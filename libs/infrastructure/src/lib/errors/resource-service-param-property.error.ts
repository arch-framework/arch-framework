export class ArchResourceServiceParamPropertyError extends TypeError {
    property: string;

    constructor(property: string) {
        super(`Property ${property} is not define in resource service param object`);
        this.property = property;
    }
}
