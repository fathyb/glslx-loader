import {dirname} from 'path'
import * as mkdirp from 'mkdirp-promise'

import {compile} from './compiler/typescript'
import {parse, Shader} from './glslx'
import {findFiles, readFile, writeFile} from './utils'

export async function generateDeclaration(file: string, shaders: Shader[]): Promise<void> {
    const result = `${compile(shaders)}\n`
    const actual = await readFile(file).catch(() => '')

    if(result !== actual) {
        await mkdirp(dirname(file))

        return writeFile(file, result)
    }
}

export async function run() {
    const files = await findFiles(process.argv.slice(2))

    await Promise.all(
        files.map(async file => {
            const source = await readFile(file)

            return generateDeclaration(`${file}.d.ts`, parse(source))
        })
    )
}
