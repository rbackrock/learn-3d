import {
  createProgramInstance,
  loadImage,
  loadImages
} from './utils'

/**
 * 传递顶点大小
 * @param {Object} gl canvas context
 */
export function multiAttributeSize(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute float a_point_size;

    void main() {
      gl_Position = a_position;
      gl_PointSize = a_point_size;
    }
  `
  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `

  const program = createProgramInstance(gl, vertex, fragment)
  const point = new Float32Array([
    0.0, 0.3,
    -0.3, -0.3,
    0.3, -0.3
  ])
  const sizes = new Float32Array([
    10.0, 20.0, 30.0
  ])

  // 将顶点数据写入缓冲区开启
  const vertextBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  // 将顶点大小数据写入缓冲区开启
  const pointBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW)
  const a_point_size = gl.getAttribLocation(program, 'a_point_size')
  gl.vertexAttribPointer(a_point_size, 1, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_point_size)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, drawCount)
}

/**
 * 传递顶点大小（使用数据大包使用步进和偏移参数）
 * @param {Object} gl canvas context
 */
export function multiAttributeSizeInterleaved(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute float a_point_size;

    void main() {
      gl_Position = a_position;
      gl_PointSize = a_point_size;
    }
  `
  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `

  const program = createProgramInstance(gl, vertex, fragment)
  const drawData = new Float32Array([
    0.0, 0.3, 10.0,
    -0.3, -0.3, 20.0,
    0.3, -0.3, 30.0
  ])

  // 将顶点数据写入缓冲区开启
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 3, 0)
  gl.enableVertexAttribArray(a_position)

  const a_point_size = gl.getAttribLocation(program, 'a_point_size')
  gl.vertexAttribPointer(a_point_size, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2)
  gl.enableVertexAttribArray(a_point_size)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, drawCount)
}

/**
 * 传递颜色值给片元着色器
 * @param {Object} gl canvas context
 */
export function multiAttributeColor(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;

    void main() {
      gl_Position = a_position;
      v_color = a_color;
      gl_PointSize = 10.0;
    }
  `
  const fragment = `
    precision mediump float;

    varying vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }
  `

  const program = createProgramInstance(gl, vertex, fragment)
  const drawData = new Float32Array([
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5,-0.5, 0.0, 1.0, 0.0,
    0.5,-0.5, 0.0, 0.0, 1.0
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 5, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
  gl.enableVertexAttribArray(a_color)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, drawCount)
}

/**
 * 最简单的纹理映射
 * @param {Object} gl canvas context
 */
export function textureQuad(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    varying vec2 v_texcoord;

    void main() {
      gl_Position = a_position;
      v_texcoord = a_texcoord;
    }
  `
  const fragment = `
    precision mediump float;

    uniform sampler2D u_sampler;
    varying vec2 v_texcoord;

    void main() {
      gl_FragColor = texture2D(u_sampler, v_texcoord);
    }
  `

  const program = createProgramInstance(gl, vertex, fragment)
  const drawData = new Float32Array([
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  // 传入顶点坐标
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_position)

  // 传入纹理坐标
  const a_texcoord = gl.getAttribLocation(program, 'a_texcoord')
  gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_texcoord)

  // 配置纹理
  const texture = gl.createTexture()
  const u_sampler = gl.getUniformLocation(program, 'u_sampler')

  loadImage('/resources/sky.jpg').then(image => {
    // Y 轴反转，这事因为 PNG BMP JPG 等图片坐标和 WebGL 纹理坐标系统不一致，图片坐标系统原点在左上角，纹理坐标系统是在左下角
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    // 激活纹理单元
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // 配置纹理对象的参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(u_sampler, 0)

    const drawCount = 4
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, drawCount)
  })
}

/**
 *  多纹理贴图
 * @param {Object} gl canvas context
 */
export function multiTexture(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    varying vec2 v_texcoord;

    void main() {
      gl_Position = a_position;
      v_texcoord = a_texcoord;
    }
  `
  const fragment = `
    precision mediump float;

    uniform sampler2D u_sampler0;
    uniform sampler2D u_sampler1;
    varying vec2 v_texcoord;

    void main() {
      vec4 color0 = texture2D(u_sampler0, v_texcoord);
      vec4 color1 = texture2D(u_sampler1, v_texcoord);
      gl_FragColor = color0 * color1;
    }
  `

  const program = createProgramInstance(gl, vertex, fragment)
  const drawData = new Float32Array([
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  // 传入顶点坐标
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(a_position)

  // 传入纹理坐标
  const a_texcoord = gl.getAttribLocation(program, 'a_texcoord')
  gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(a_texcoord)

  // 配置纹理
  const texture0 = gl.createTexture()
  const texture1 = gl.createTexture()
  const u_sampler0 = gl.getUniformLocation(program, 'u_sampler0')
  const u_sampler1 = gl.getUniformLocation(program, 'u_sampler1')

  loadImages([
    '/resources/sky.jpg',
    '/resources/circle.gif'
  ]).then(images => {
    const [ image0, image1 ] = images

    // 纹理0
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture0)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0)
    gl.uniform1i(u_sampler0, 0)

    // 纹理1
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, texture1)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1)
    gl.uniform1i(u_sampler1, 1)

    const drawCount = 4
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, drawCount)
  })
}
