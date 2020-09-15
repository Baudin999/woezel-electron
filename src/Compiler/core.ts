/**
     * Type of objects whose values are all of the same type.
     * The `in` and `for-in` operators can *not* be safely used,
     * since `Object.prototype` may be modified by outside code.
     */
export interface MapLike<T> {
    [index: string]: T;
}


const hasOwnProperty = Object.prototype.hasOwnProperty;

export function getOwnKeys<T>(map: MapLike<T>): string[] {
    const keys: string[] = [];
    for (const key in map) {
        if (hasOwnProperty.call(map, key)) {
            keys.push(key);
        }
    }

    return keys;
}
const _entries = Object.entries || (<T>(obj: MapLike<T>) => {
    const keys = getOwnKeys(obj);
    const result: [string, T][] = Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
        result[i] = [keys[i], obj[keys[i]]];
    }
    return result;
});
export function getEntries<T>(obj: MapLike<T>): [string, T][] {
    return obj ? _entries(obj) : [];
}