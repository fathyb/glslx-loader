import {Shader} from '../../glslx'

export function compile(this: any, shaders: Shader[]): string {
	const result = shaders.map(shader => {
		const attributes = JSON.stringify(shader.attributes)
		const uniforms = JSON.stringify(shader.uniforms)
		const contents = JSON.stringify(shader.contents)

		return `
export function ${shader.name}(gl, type) {
	Shader.call(this, gl, type, ${shader.name}.source)
}

${shader.name}.source = ${contents}
${shader.name}.attributes = ${attributes}
${shader.name}.uniforms = ${uniforms}
`
	})
	.join('\n')
	
	return `import {Shader} from 'glslx-loader/runtime/shader'\n${result}\n`
}
