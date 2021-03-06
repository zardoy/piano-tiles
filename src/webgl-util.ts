export const createProgram = (gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) => {
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) throw new Error(`Unable to create shader ${source}`);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Shader compile error: " + info);
        }
        return shader;
    };

    const program = gl.createProgram();
    // just adding the shaders
    if (!program) throw new Error(`Unable to create program`);
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
    // and linking them here
    gl.linkProgram(program);
    const linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linkSuccess) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("Program link error: " + info);
    }
    return program;
};