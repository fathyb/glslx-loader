import {VariableList} from '../../runtime'

const PTR_ARGS = 'size: number, type: number, normalized: boolean, stride: number, offset: number'

export function compileAttributes(attributes: VariableList): string {
    return attributes.map(({name, type}) => {
        const pascal = name.replace(/^./, x => x.toUpperCase())
        const setter = `set${pascal}`
        const pointer = `\t${setter}Pointer(${PTR_ARGS}): void`
        const enable = `enable${pascal}(): void`
        const disable = `disable${pascal}(): void`
        const toggle = `\t${enable}\n\t${disable}`
        const first = `${toggle}\n${pointer}`

        let generic: string|null = null

        if(type === 'float') {
            generic = `${setter}(x: number)`
        }
        else if(type === 'vec2') {
            generic = `${setter}(x: number, y: number)`
        }
        else if(type === 'vec3') {
            generic = `${setter}(x: number, y: number, z: number)`
        }
        else if(type === 'vec4') {
            generic = `${setter}(x: number, y: number, z: number, w: number)`
        }
        else {
            return first
        }

        return `${first}\n\t${generic}: void`
    }).join('\n')
}
