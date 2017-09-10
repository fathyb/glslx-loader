import * as glob from 'glob'

export function promise<T>(fn: (...args: any[]) => any, ...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        fn(...args, (err: Error, result: T) => {
            if(err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}

export function findFiles(pattern: string|string[]): Promise<string[]> {
    if(Array.isArray(pattern)) {
        return Promise
            .all(pattern.map(findFiles))
            .then(paths => paths.reduce((a, b) => a.concat(b), []))
    }

    return new Promise((resolve, reject) => {
        glob(pattern, {}, (err, result) => {
            if(err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}

export function map<T, V>(object: {
    [key: string]: T
}, each: (k: string, v: T, idx: number) => V): V[] {
    return Object.keys(object).map((key, idx) => each(key, object[key], idx))
}
