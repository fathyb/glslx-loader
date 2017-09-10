import {Shader} from '../../glslx'

import {compileAttributes} from './attributes'
import {compileUniforms} from './uniforms'

export function compileBody(shader: Shader) {
    const attributes = compileAttributes(shader.attributes)
    const uniforms = compileUniforms(shader.uniforms)

    if(attributes.length === 0 && uniforms.length === 0) {
        return ''
    }

    if(attributes.length === 0) {
        return `\n${uniforms}\n`
    }
    else if(uniforms.length === 0) {
        return `\n${attributes}\n`
    }

    return `\n${attributes}\n\n${uniforms}\n`
}
