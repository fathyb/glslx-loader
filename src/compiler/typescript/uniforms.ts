import {VariableList} from '../../runtime'

export function compileUniforms(uniforms: VariableList): string {
    return uniforms.map(({name, type}) => {
        const setter = name.replace(/^./, x => x.toUpperCase())
        let args: string|null = null
    
        if(/(sampler)|(float)|(int)|(bool)/.test(type)) {
            args = 'value: number'
        }
        else if(/mat(2|3|4)/.test(type)) {
            args = 'value: Float32Array|number[], transpose?: boolean'
        }
        else if(/vec2/.test(type)) {
            args = 'x: number, y: number'
        }
        else if(/vec3/.test(type)) {
            args = 'x: number, y: number, z: number'
        }
        else if(/vec4/.test(type)) {
            args = 'x: number, y: number, z: number, w: number'
        }
        else {
            throw new Error(`Unknown type ${type}`)
        }

        return `\tset${setter}(${args}): void`
    }).join('\n')
}
