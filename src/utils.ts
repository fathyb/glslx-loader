import {dirname} from 'path'
import * as fs from 'fs'

import * as glob from 'glob'
import * as mkdirp from 'mkdirp-promise'


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

export function readFile(path: string) {
    return promise<string>(fs.readFile, path, {encoding: 'utf-8'})
}

export async function writeFile(path: string, contents: string|Buffer) {
    await mkdirp(dirname(path))

    return promise<void>(fs.writeFile, path, contents)
}

export function map<T, V>(object: {
    [key: string]: T
}, each: (k: string, v: T, idx: number) => V): V[] {
    return Object.keys(object).map((key, idx) => each(key, object[key], idx))
}
