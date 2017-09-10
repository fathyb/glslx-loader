export type VariableType =
    'bool'|
    'bvec2'|'bvec3'|'bvec4'|

    'int'|
    'ivec2'|'ivec3'|'ivec4'|

    'float'|
    'vec2'|'vec3'|'vec4'|
    'mat2'|'mat3'|'mat4'|

    'sampler2D'|'samplerCube'

export type VariableList = {
    type: VariableType
    name: string
    symbol: string
}[]

export class ShaderCompilationError extends Error {}

export class Shader {
    public static readonly source: string
    public static readonly attributes: VariableList
    public static readonly uniforms: VariableList

    constructor(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type)

        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new ShaderCompilationError(gl.getShaderInfoLog(shader) || 'Unknown error')
        }

        (this as any).shader = shader
    }
}
