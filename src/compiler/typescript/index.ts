import {Shader} from '../../glslx'

import {compileBody} from './body'

export function compile(shaders: Shader[]): string {
    return `import {Shader} from 'glslx-loader/runtime/shader'\n${shaders.map(compileShader).join('\n')}`
}

export function compileShader(shader: Shader) {
    return `\nexport class ${shader.name} extends Shader {${compileBody(shader)}}`
}
