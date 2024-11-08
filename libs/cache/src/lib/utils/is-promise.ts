export function isPromise(obj: any): obj is Promise<any> {
    return !!obj && Object.prototype.toString.call(obj) === '[object Promise]';
}
