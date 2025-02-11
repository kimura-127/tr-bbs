export async function getWebGLFingerprint() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');

  if (!gl) return null;

  try {
    // 1. レンダリングテスト（改竄が難しい）
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return null;

    gl.shaderSource(
      vertexShader,
      `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `
    );
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return null;

    gl.shaderSource(
      fragmentShader,
      `
        precision highp float;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `
    );
    gl.compileShader(fragmentShader);

    // 2. パフォーマンス特性（改竄が難しい）
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // 3. 浮動小数点数の精度特性（改竄が難しい）
    const vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // キャンバスの出力を取得（GPUの特性が反映される）
    const renderResult = canvas.toDataURL();

    // WebGLの詳細情報を収集
    return {
      renderHash: renderResult,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      precision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT),
    };
  } catch (error) {
    console.error('WebGL fingerprint generation failed:', error);
    return null;
  }
}
