declare module "fathyb-glslx-fork" {
    type VariableType = 
        'bool'|
        'bvec2'|'bvec3'|'bvec4'|

        'int'|
        'ivec2'|'ivec3'|'ivec4'|

        'float'|
        'vec2'|'vec3'|'vec4'|
        'mat2'|'mat3'|'mat4'|

        'sampler2D'|'samplerCube'

    export function compile(code: string, options?: {}): {
        log?: string
        output?: {
            shaders: {
                name: string
                contents: string
                uniforms: {
                    [key: string]: VariableType
                }
                attributes: {
                    [key: string]: VariableType
                }
            }[]
            renaming: {
                [key: string]: string
            }
        }
    }
}

declare module "mkdirp-promise"
