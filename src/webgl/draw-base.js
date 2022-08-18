import {
  createProgramInstance,
  clientArea2CanvasCoordinate
} from './utils'

/**
 * 简餐的画出一个点
 * @param {Object} gl canvas context
 */
export function drawPoint(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    void main() {
      gl_Position = a_position;
      gl_PointSize = 10.0;
    }
  `

  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  
  const program = createProgramInstance(gl, vertex, fragment)
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0)
  
  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, drawCount)
}

/**
 * 通过鼠标点击事件画出点
 * @param {Object} gl canvas context
 */
export function drawPointClick(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    void main() {
      gl_Position = a_position;
      gl_PointSize = 10.0;
    }
  `

  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  const program = createProgramInstance(gl, vertex, fragment)
  const canvas = gl.canvas
  const pointList = []
  canvas.addEventListener('click', function(evt) {
    const {
      x,
      y
    } = clientArea2CanvasCoordinate(evt.clientX, evt.clientY, canvas)
    pointList.push(x)
    pointList.push(y)

    gl.clear(gl.COLOR_BUFFER_BIT)
    const drawCount = pointList.length / 2
    for (let i = 0; i < pointList.length; i += 2) {
      const a_position = gl.getAttribLocation(program, 'a_position')
      gl.vertexAttrib3f(a_position, pointList[i], pointList[i + 1], 0.0)
      gl.drawArrays(gl.POINTS, 0, drawCount)
    }
  })
}

/**
 * 画出三角形
 * @param {Object} gl canvas context
 */
export function drawTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    void main() {
      gl_Position = a_position;
    }
  `

  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `

  const point = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])

  const program = createProgramInstance(gl, vertex, fragment)
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 平移三角形
 * @param {Object} gl canvas context
 */
export function translateTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    void main() {

    }
  `
  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
}

/**
 * 旋转三角形
 * @param {Object} gl canvas context
 */
export function rotateTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;
    
    uniform float u_cosB;
    uniform float u_sinB;
    
    void main() {
      gl_Position.x = a_position.x * u_cosB - a_position.y * u_sinB;
      gl_Position.y = a_position.x * u_sinB + a_position.y * u_cosB;
      gl_Position.z = a_position.z;
      gl_Position.w = 1.0;
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
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)

  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  const radian = Math.PI * 90.0 / 180.0
  const u_cosB = gl.getUniformLocation(program, 'u_cosB')
  const u_sinB = gl.getUniformLocation(program, 'u_sinB')
  gl.uniform1f(u_cosB, Math.cos(radian))
  gl.uniform1f(u_sinB, Math.sin(radian))

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 通过举证旋转三角形
 * @param {Object} gl canvas context
 */
export function matrixRotateTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    uniform mat4 u_mat;

    void main() {
      gl_Position = u_mat * a_position;
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
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  const radian = Math.PI * 90.0 / 180.0
  const cosB = Math.cos(radian)
  const sinB = Math.sin(radian)
  const mat = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ])
  const u_mat = gl.getUniformLocation(program, 'u_mat')
  gl.uniformMatrix4fv(u_mat, false, mat)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 通过作者编写的矩阵操作库旋转三角形
 * @param {Object} gl canvas context
 */ 
export function matrixRotateTriangleLib(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    uniform mat4 u_mat;

    void main() {
      gl_Position = u_mat * a_position;
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
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  const ANGLE = 90
  const xformMatrix = new Matrix4()
  xformMatrix.setRotate(ANGLE, 0, 0, 1)

  const u_mat = gl.getUniformLocation(program, 'u_mat')
  gl.uniformMatrix4fv(u_mat, false, xformMatrix.elements)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 通过作者编写的矩阵操作库平移旋转三角形
 * @param {Object} gl canvas context
 */ 
export function matrixRotateAndTranslateTriangleLib(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    uniform mat4 u_model_mat;

    void main() {
      gl_Position = u_model_mat * a_position;
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
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  const ANGLE = 60
  const TX = 0.5
  const modelMatrix = new Matrix4()
  modelMatrix.setRotate(ANGLE, 0, 0, 1)
  modelMatrix.translate(TX, 0, 0, 0)

  const u_model_mat = gl.getUniformLocation(program, 'u_model_mat')
  gl.uniformMatrix4fv(u_model_mat, false, modelMatrix.elements)

  const drawCount = 3
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, drawCount)
}

/**
 * 三角形动画
 * @param {Object} gl canvas context
 */
export function animateRotateTriangle(gl) {
  const vertex = `
    precision mediump float;

    attribute vec4 a_position;

    uniform mat4 u_model_mat;

    void main() {
      gl_Position = u_model_mat * a_position;
    }
  `
  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  const program = createProgramInstance(gl, vertex, fragment)
  const point = new Float32Array([
    0.0, 0.3,
    -0.3, -0.3,
    0.3, -0.3
  ])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, point, gl.STATIC_DRAW)
  const a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_position)

  let currentAngle = 0.0
  function draw(time) {
    currentAngle = animate(time, currentAngle)
    const modelMatrix = new Matrix4()
    modelMatrix.setRotate(currentAngle, 0, 0, 1)
    const u_model_mat = gl.getUniformLocation(program, 'u_model_mat')
    gl.uniformMatrix4fv(u_model_mat, false, modelMatrix.elements)

    const drawCount = 3
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, drawCount)

    window.requestAnimationFrame(draw)
  }

  let previousTimeStamp
  function animate(angle) {
    const now = new Date()
    const elapsed = now - previousTimeStamp
    previousTimeStamp = now

    const ANGLE_STEP = 45.0
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
    return newAngle %= 360
  }

  draw()
}
