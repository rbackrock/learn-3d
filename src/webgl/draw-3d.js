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
    console.log(evt)

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
