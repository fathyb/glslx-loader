import {compile as glslx} from 'glslx'

import {VariableType} from './runtime'
import {map} from './utils'

export type VariableList = {
    type: VariableType
    name: string
    symbol: string
}[]

export interface Shader {
    name: string
    contents: string
    uniforms: VariableList
    attributes: VariableList
}

export class ParsingError extends Error {
    public readonly hideStack = true
    public readonly loc?: {
        line: number
        column: number
    }

    constructor(message: string) {
        super(message.replace(/<stdin>:\d*:\d*: error: /, ''))
        
        const loc = message.match(/<stdin>:(\d+):(\d+)/)

        if(loc && loc.length === 3) {
            this.loc = {
                line: parseInt(loc[1]),
                column: parseInt(loc[2])
            }
        }
    }
}

export function parse(source: string): Shader[] {
    const result = glslx(source, {
        format: 'object'
    })
    const {output, log} = result

    if(!output) {
        throw new ParsingError(log || 'Unknown GLSLX error')
    }
    
    return output.shaders.map(shader => {
        const uniforms = map(shader.uniforms, (name, type) => {
            const symbol = output.renaming[name]

            if(!symbol) {
                throw new Error(`Cannot find symbol for uniform ${name}`)
            }

            return {name, type, symbol}
        })
        const attributes = map(shader.attributes, (name, type) => {
            const symbol = output.renaming[name]

            if(!symbol) {
                throw new Error(`Cannot find symbol for attribute ${name}`)
            }

            return {name, type, symbol}
        })

        return {
            uniforms, attributes,
            name: shader.name,
            contents: shader.contents
        }
    })
}
