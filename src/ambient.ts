import {readFile, writeFile} from 'fs'
import {dirname} from 'path'
import * as mkdirp from 'mkdirp-promise'

import {compile} from './compiler/typescript'
import {parse, Shader} from './glslx'
import {findFiles, promise} from './utils'

export async function generateDeclaration(file: string, shaders: Shader[]): Promise<void> {
    const result = `${compile(shaders)}\n`
    const actual = await promise<string>(readFile, file, {encoding: 'utf-8'}).catch(() => '')

    if(result !== actual) {
        await mkdirp(dirname(file))

        return promise<void>(writeFile, file, result)
    }
}

export async function run() {
    const files = await findFiles(process.argv.slice(2))

    await Promise.all(
        files.map(async file => {
            const source = await promise<string>(readFile, file, {encoding: 'utf-8'})

            return generateDeclaration(`${file}.d.ts`, parse(source))
        })
    )
}
