import {resolve} from 'path'

import {parse} from './glslx'
import {compile} from './compiler/javascript'
import {generateDeclaration} from './ambient'
import {readFile, writeFile, findFiles} from './utils'

export function loader(this: any, content: string): void {
	const callback = this.async()
	const {resourcePath: path} = this

	void async function() {
		const shaders = parse(content)
		const rootDir = resolve('src')
		const outDir = resolve('build/gen-src')
		const output = resolve(path).replace(rootDir, outDir)

		await generateDeclaration(`${output}.d.ts`, shaders)

		return compile(shaders)
	}().then(
		result => callback(null, result),
		err => callback(err)
	)
}

export async function generateRuntime(src: string, dest: string = `${src}.js`, decl: boolean = true): Promise<void> {
	const content = await readFile(src)
	const shaders = parse(content)
	const promises = [writeFile(dest, compile(shaders))]

	if(decl) {
		promises.push(generateDeclaration(`${src}.d.ts`, shaders))
	}

	await Promise.all(promises)
}

export async function run() {
    const files = await findFiles(process.argv.slice(2))

    await Promise.all(
        files.map(file => generateRuntime(file))
    )
}

