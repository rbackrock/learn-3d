import {
  createProgramInstance
} from './utils'

/**
 * 使用过视点观察画出三角形
 * @param {Object} gl canvas context
 */
export function lootAtTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_view_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_view_matrix * a_position;
      v_color = a_color;
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
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 后面绿色三角形
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 中间黄色三角形
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 前面蓝色三角形
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ])

  // buffer
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const u_view_matrix = gl.getUniformLocation(program, 'u_view_matrix')
  const viewMatrix = new Matrix4()
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_view_matrix, false, viewMatrix.elements)

  const drawCount = 9
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 使用过视点进行旋转观察画出三角形
 * @param {Object} gl canvas context
 */
export function lootAtRotatedTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_view_matrix;
    uniform mat4 u_model_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_view_matrix * u_model_matrix * a_position;
      v_color = a_color;
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
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 后面绿色三角形
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 中间黄色三角形
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 前面蓝色三角形
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ])

  // buffer
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const u_view_matrix = gl.getUniformLocation(program, 'u_view_matrix')
  const u_model_matrix = gl.getUniformLocation(program, 'u_model_matrix')

  // 指定视点和视线
  const viewMatrix = new Matrix4()
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0)
  // 计算旋转矩阵
  const modelMartix = new Matrix4()
  modelMartix.setRotate(-10, 0, 0, 1)

  gl.uniformMatrix4fv(u_view_matrix, false, viewMatrix.elements)
  gl.uniformMatrix4fv(u_model_matrix, false, modelMartix.elements)

  const drawCount = 9
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 使用过视点进行旋转观察画出三角形（事先计算好矩阵）
 * @param {Object} gl canvas context
 */
export function lootAtRotatedTriangleMvMatrix(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_model_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_model_matrix * a_position;
      v_color = a_color;
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
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 后面绿色三角形
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 中间黄色三角形
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 前面蓝色三角形
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ])

  // buffer
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const u_model_matrix = gl.getUniformLocation(program, 'u_model_matrix')

  // 指定视点和视线
  const viewMatrix = new Matrix4()
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0)
  // 计算旋转矩阵
  const modelMartix = new Matrix4()
  modelMartix.setRotate(-10, 0, 0, 1)
  const modelViewMartix = viewMatrix.multiply(modelMartix)

  gl.uniformMatrix4fv(u_model_matrix, false, modelViewMartix.elements)

  const drawCount = 9
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 通过键盘上下左右键改变视点
 * @param {Object} gl canvas context
 */
export function lootAtTriangleWithKeys(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_view_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_view_matrix * a_position;
      v_color = a_color;
    }
  `
  const fragment = `
    precision mediump float;

    varying vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }
  `
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  const program = createProgramInstance(gl, vertex, fragment)
  const drawData = new Float32Array([
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 后面绿色三角形
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 中间黄色三角形
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 前面蓝色三角形
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ])

  // buffer
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  const viewMatrix = new Matrix4()
  const viewMatrixMapper = [0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0]
  function draw(gl, viewMatrix, viewMatrixData) {
    const u_view_matrix = gl.getUniformLocation(program, 'u_view_matrix')
    viewMatrix.setLookAt(...viewMatrixData)
    gl.uniformMatrix4fv(u_view_matrix, false, viewMatrix.elements)

    const drawCount = 9
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, drawCount)
  }

  window.addEventListener('keydown', function(evt) {
    const KEY_CODE_RIGHT_ARROW = 'ArrowRight'
    const KEY_CODE_LEFT_ARROW = 'ArrowLeft'
    const keyCode = evt.code

    if (keyCode === KEY_CODE_LEFT_ARROW) {
      viewMatrixMapper[0] -= 0.01
      draw(gl, viewMatrix, viewMatrixMapper)
    } else if (keyCode === KEY_CODE_RIGHT_ARROW) {
      viewMatrixMapper[0] += 0.01
      draw(gl, viewMatrix, viewMatrixMapper)
    }
  })

  draw(gl, viewMatrix, viewMatrixMapper)
}

/**
 * 正射投影示例
 * @param {Object} gl canvas context
 */
export function orthView(gl) {
  const infoElement = document.createElement('p')
  infoElement.id = 'near-far'
  document.getElementById('canvas').insertAdjacentElement('afterend', infoElement)

  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_proj_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_proj_matrix * a_position;
      v_color = a_color;
    }
  `
  const fragment = `
    precision mediump float;

    varying vec4 v_color;

    void main() {
      gl_FragColor = v_color;
    }
  `

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  const program = createProgramInstance(gl, vertex, fragment)
  const drawData = new Float32Array([
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 后面绿色三角形
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 中间黄色三角形
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 前面蓝色三角形
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ])

  // buffer
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  const u_proj_matrix = gl.getUniformLocation(program, 'u_proj_matrix')
  const orthDataMapper = [-1, 1, -1, 1, 0.0, 0.5]
  const orthDataMapperLength = orthDataMapper.length
  const projMatrix = new Matrix4()
  function draw(gl, projMatrix, orthDataMapper) {
    projMatrix.setOrtho(...orthDataMapper)
    gl.uniformMatrix4fv(u_proj_matrix, false, projMatrix.elements)

    const drawCount = 9
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, drawCount)

    document.getElementById('near-far').innerHTML = `
      near:${Math.round(orthDataMapper[orthDataMapperLength - 2] * 100) / 100},far:${Math.round(orthDataMapper[orthDataMapperLength - 1] * 100) / 100}
    `
  }

  window.addEventListener('keydown', function(evt) {
    const KEY_CODE_RIGHT_ARROW = 'ArrowRight'
    const KEY_CODE_LEFT_ARROW = 'ArrowLeft'
    const KEY_CODE_UP_ARROW = 'ArrowUp'
    const KEY_CODE_DOWN_ARROW = 'ArrowDown'

    switch(evt.code) {
      case KEY_CODE_RIGHT_ARROW:
        orthDataMapper[orthDataMapperLength - 2] += 0.1
        break
      case KEY_CODE_LEFT_ARROW:
        orthDataMapper[orthDataMapperLength - 2] -= 0.1
        break
      case KEY_CODE_UP_ARROW:
        orthDataMapper[orthDataMapperLength - 1] += 0.1
        break
      case KEY_CODE_DOWN_ARROW:
        orthDataMapper[orthDataMapperLength - 1] -= 0.1
        break
    }

    draw(gl, projMatrix, orthDataMapper)
  })

  draw(gl, projMatrix, orthDataMapper)
}

/**
 * 透视投影示例
 * @param {Object} gl canvas context
 */
export function perspectiveView(gl, canvas) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_view_matrix;
    uniform mat4 u_proj_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_proj_matrix * u_view_matrix * a_position;
      v_color = a_color;
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
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  const drawData = new Float32Array([
    0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    1.25, -1.0, -4.0, 1.0, 0.4, 0.4,
    0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
    0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,
    0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // The front blue one 
    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    1.25, -1.0, 0.0, 1.0, 0.4, 0.4,
    // Three triangles on the left side
    -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
    -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,
    -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
    -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,
    -0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // The front blue one 
    -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    -0.25, -1.0, 0.0, 1.0, 0.4, 0.4
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, drawData, gl.STATIC_DRAW)
  const FSIZE = drawData.BYTES_PER_ELEMENT

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  const u_view_matrix = gl.getUniformLocation(program, 'u_view_matrix')
  const u_proj_matrix = gl.getUniformLocation(program, 'u_proj_matrix')

  const viewMatrix = new Matrix4()
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0)
  const projMatrix = new Matrix4()
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)

  gl.uniformMatrix4fv(u_view_matrix, false, viewMatrix.elements)
  gl.uniformMatrix4fv(u_proj_matrix, false, projMatrix.elements)

  const drawCount = 18
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 绘制正方体
 * @param {Object} gl canvas context
 */
export function helloCube(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_mvp_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_mvp_matrix * a_position;
      v_color = a_color;
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
  const verticesColors = new Float32Array([
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 White
    -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 Magenta
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 Red
    1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3 Yellow
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4 Green
    1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5 Cyan
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6 Blue
    -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // v7 Black
  ])
  const indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, // front
    0, 3, 4, 0, 4, 5, // right
    0, 5, 6, 0, 6, 1, // up
    1, 6, 7, 1, 7, 2, // left
    7, 4, 3, 7, 3, 2, // down
    4, 7, 6, 4, 6, 5 // back
  ])
  const FSIZE = verticesColors.BYTES_PER_ELEMENT

  const verticesColorsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  // position
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_position)

  // color
  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_color)

  // indices
  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  const u_mvp_matrix = gl.getUniformLocation(program, 'u_mvp_matrix');
  const mvpMatrix = new Matrix4()
  mvpMatrix.setPerspective(30, 1, 1, 100)
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_mvp_matrix, false, mvpMatrix.elements);

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}

/**
 * 绘制正方体
 * @param {Object} gl canvas context
 */
export function colorCube(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_mvp_matrix;
    varying vec4 v_color;

    void main() {
      gl_Position = u_mvp_matrix * a_position;
      v_color = a_color;
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
  const verticesColors = new Float32Array([
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
  ])

  const color = new Float32Array([
    0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, // v0-v1-v2-v3 front(blue)
    0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, // v0-v3-v4-v5 right(green)
    1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, // v0-v5-v6-v1 up(red)
    1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, // v1-v6-v7-v2 left
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v7-v4-v3-v2 down
    0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0 // v4-v7-v6-v5 back
  ])
  const indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // right
    8, 9, 10, 8, 10, 11, // up
    12, 13, 14, 12, 14, 15, // left
    16, 17, 18, 16, 18, 19, // down
    20, 21, 22, 20, 22, 23 // back
  ])

  // position
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  // color
  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW)

  const a_color = gl.getAttribLocation(program, 'a_color')
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_color)
  
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  const u_mvp_matrix = gl.getUniformLocation(program, 'u_mvp_matrix')
  const mvpMatrix = new Matrix4()
  mvpMatrix.setPerspective(30, 1, 1, 100)
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_mvp_matrix, false, mvpMatrix.elements)

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}
