import {Shader} from './shader'

function ProgramConstructor(this: any, gl: WebGLRenderingContext, Vertex: typeof Shader, Fragment: typeof Shader) {
    const program = gl.createProgram()

    const {shader: vertex} = new Shader(gl, gl.VERTEX_SHADER, Vertex.source) as {shader: WebGLShader}
    const {shader: fragment} = new Shader(gl, gl.FRAGMENT_SHADER, Fragment.source) as {shader: WebGLShader}
    
    this.vertex = vertex
    this.fragment = fragment
    this.program = program

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    
    gl.linkProgram(program)

    const {attributes} = Vertex

    for(let i = 0; i < attributes.length; i++) {
        const {name, type, symbol} = attributes[i]
        const pascal = name.replace(/^./, x => x.toUpperCase())
        const setter = `set${pascal}`
        const location = gl.getAttribLocation(program, symbol)

        this[`enable${pascal}`] = function() {
            gl.enableVertexAttribArray(location)
        }
        this[`disable${pascal}`] = function() {
            gl.disableVertexAttribArray(location)
        }

        this[`${setter}Pointer`] = function(
            size: number, type: number, normalized: boolean, stride: number, offset: number
        ) {
            gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
        }

        if(type === 'float') {
            this[setter] = function(v: number) {
                gl.vertexAttrib1f(location, v)
            }
        }
        else if(type === 'vec2') {
            this[setter] = function(x: number, y: number) {
                gl.vertexAttrib2f(location, x, y)
            }
        }
        else if(type === 'vec3') {
            this[setter] = function(x: number, y: number, z: number) {
                gl.vertexAttrib3f(location, x, y, z)
            }
        }
        else if(type === 'vec4') {
            this[setter] = function(x: number, y: number, z: number, w: number) {
                gl.vertexAttrib4f(location, x, y, z, w)
            }
        }
        else {
            throw new Error(`Unsupported vertex attribute type "${type}"`)
        }
    }

    const uniforms = Vertex.uniforms.concat(Fragment.uniforms)
    
    for(let i = 0; i < uniforms.length; i++) {
        const {type, name, symbol} = uniforms[i]
        const location = gl.getUniformLocation(program, symbol)
        const setter = `set${name.replace(/^./, x => x.toUpperCase())}`

        if(location === null || typeof location === 'undefined') {
            throw new Error(`Cannot find uniform ${name}`)
        }

        if(type === 'int' || type === 'bool' || /^sampler/.test(type)) {
            this[setter] = function(v: number) {
                gl.uniform1i(location, v)
            }
        }
        else if(type === 'float') {
            this[setter] = function(v: number) {
                gl.uniform1f(location, v)
            }
        }
        else if(type === 'vec2') {
            this[setter] = function(x: number, y: number) {
                gl.uniform2f(location, x, y)
            }
        }
        else if(type === 'ivec2' || type === 'bvec2') {
            this[setter] = function(x: number, y: number) {
                gl.uniform2i(location, x, y)
            }
        }
        else if(type === 'vec3') {
            this[setter] = function(x: number, y: number, z: number) {
                gl.uniform3f(location, x, y, z)
            }
        }
        else if(type === 'ivec3' || type === 'bvec3') {
            this[setter] = function(x: number, y: number, z: number) {
                gl.uniform3i(location, x, y, z)
            }
        }
        else if(type === 'vec4') {
            this[setter] = function(x: number, y: number, z: number, w: number) {
                gl.uniform4f(location, x, y, z, w)
            }
        }
        else if(type === 'ivec4') {
            this[setter] = function(x: number, y: number, z: number, w: number) {
                gl.uniform4i(location, x, y, z, w)
            }
        }
        else if(type === 'mat2') {
            this[setter] = function(matrix: number[]|Float32Array, transpose = false) {
                if(transpose) {
                    TMP_MAT2[0] = matrix[0]
                    TMP_MAT2[1] = matrix[2]
                    TMP_MAT2[2] = matrix[1]
                    TMP_MAT2[3] = matrix[3]

                    matrix = TMP_MAT2
                }

                gl.uniformMatrix2fv(location, false, matrix)
            }
        }
        else if(type === 'mat3') {
            this[setter] = function(matrix: number[]|Float32Array, transpose = false) {
                if(transpose) {
                    TMP_MAT3[0] = matrix[0]
                    TMP_MAT3[1] = matrix[3]
                    TMP_MAT3[2] = matrix[6]
                    TMP_MAT3[3] = matrix[1]
                    TMP_MAT3[4] = matrix[4]
                    TMP_MAT3[5] = matrix[7]
                    TMP_MAT3[6] = matrix[2]
                    TMP_MAT3[7] = matrix[5]
                    TMP_MAT3[8] = matrix[8]

                    matrix = TMP_MAT3
                }

                gl.uniformMatrix3fv(location, false, matrix)
            }
        }
        else if(type === 'mat4') {
            this[setter] = function(matrix: number[]|Float32Array, transpose = false) {
                if(transpose) {
                    TMP_MAT4[0] = matrix[0]
                    TMP_MAT4[1] = matrix[4]
                    TMP_MAT4[2] = matrix[8]
                    TMP_MAT4[3] = matrix[12]
                    TMP_MAT4[4] = matrix[1]
                    TMP_MAT4[5] = matrix[5]
                    TMP_MAT4[6] = matrix[9]
                    TMP_MAT4[7] = matrix[13]
                    TMP_MAT4[8] = matrix[2]
                    TMP_MAT4[9] = matrix[6]
                    TMP_MAT4[10] = matrix[10]
                    TMP_MAT4[11] = matrix[14]
                    TMP_MAT4[12] = matrix[3]
                    TMP_MAT4[13] = matrix[7]
                    TMP_MAT4[14] = matrix[11]
                    TMP_MAT4[15] = matrix[15]

                    matrix = TMP_MAT4
                }

                gl.uniformMatrix4fv(location, false, matrix)
            }
        }
        else {
            throw new Error(`Unknown name "${name}"`)
        }
    }

    this.use = function() {
        gl.useProgram(program)
    }
}

const TMP_MAT2 = new Float32Array(2 * 2)
const TMP_MAT3 = new Float32Array(3 * 3)
const TMP_MAT4 = new Float32Array(4 * 4)

export type ProgramInstance<T, U> = T & U & {
    vertex: WebGLShader
    fragment: WebGLShader
    program: WebGLProgram

    use(): void
}

export type ShaderConstructor<T> = {
    new(gl: WebGLRenderingContext, type: number, source: string): T
}

export const Program: {
    new<T extends Shader, U extends Shader>(
        gl: WebGLRenderingContext,
        vertex: ShaderConstructor<T>,
        fragment: ShaderConstructor<U>
    ): ProgramInstance<T, U>
} = ProgramConstructor as any
