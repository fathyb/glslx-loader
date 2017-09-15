import {resolve} from 'path'

import * as program from 'commander'

import {compile} from './compiler/javascript'

import {generateDeclaration} from './ambient'
import {findFiles, readFile, writeFile} from './utils'
import {parse} from './glslx'

program
    .version('0.0.1')
    .usage('glslx-typescript [options] globs...')
    .option('-d, --declaration', 'Enable TypeScript declarations generation')
    .option('-t, --ts-out <out>', 'Specify the TypeScript output directories separated by commas, you should set --root when using it')
    .option('-j, --js-out <out>', 'Specify the JavaScript output directories separated by commas, you should set --root when using it')
    .option('-r, --root <root>', 'Specify the root directory, used for file rewriting by --ts-out and --js-out')
    .parse(process.argv)

let {root, declaration} = program

let tsOut: string[] = []
let jsOut: string[] = []

if(program.tsOut) {
    if(!root) {
        throw new Error('You cannot set --ts-out without --root')
    }

    declaration = true
    tsOut = program.tsOut.split(',').map((x: string) => resolve(x))
}

if(program.jsOut) {
    if(!root) {
        throw new Error('You cannot set --js-out without --root')
    }

    jsOut = program.jsOut.split(',').map((x: string) => resolve(x))
}


void async function() {
    const files = await findFiles(program.args)

    await Promise.all(
        files.map(async file => {
            const contents = await readFile(file)
            const shaders = parse(contents)
            const promises = [
                rewrite(file, jsOut, path => writeFile(`${path}.js`, compile(shaders)))
            ]

            if(declaration) {
                promises.push(
                    rewrite(file, tsOut, async path => generateDeclaration(`${path}.d.ts`, shaders))
                )
            }

            await Promise.all(promises)
        })
    )
}()

function rewrite(src: string, outs: string[], cb: (path: string) => Promise<void>): Promise<any> {
    if(!outs.length) {
        return cb(src)
    }

    return Promise.all(
        outs.map(out =>
            cb(resolve(src).replace(resolve(root), resolve(out)))
        )
    )
}
