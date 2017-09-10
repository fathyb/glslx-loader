import {resolve} from 'path'

import {parse} from './glslx'
import {compile} from './compiler/javascript'
import {generateDeclaration} from './ambient'

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
