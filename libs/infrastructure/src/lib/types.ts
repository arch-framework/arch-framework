export enum ArchResourceMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE',
}
export type ArchResourceServiceConfig = {
    /** {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/protocol Протокол} **/
    protocol: 'http' | 'https';
    /** {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname Хост} **/
    host: string;
    /** {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/port порт} **/
    port: number;
    /**
     * Часть {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname pathname} сразу после порта,
     * используется для указания адреса ресурса на балансере. Например, `api/v1` или `api/auth`.
     *
     * @remarks
     *
     * Значение может быть переопределено в {@link Resource.prefix}.
     **/
    prefix: string;
};

export type ArchResourceServiceConfigMap = Map<string, ArchResourceServiceConfig>;
