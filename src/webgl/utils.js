// 创建 program
export function createProgramInstance(gl, vertexSource, fragmentSource) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexSource)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentSource)
  gl.compileShader(fragmentShader)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  return program
}

// 客户端区域点击坐标转换为 webgl canvas 坐标
export function clientArea2CanvasCoordinate(clientX, clientY, canvasElement) {
  let x = clientX
  let y = clientY
  const rect = canvasElement.getBoundingClientRect()
  x = ((x - rect.left) - canvasElement.height / 2) / (canvasElement.height / 2)
  y = (canvasElement.width / 2 - (y - rect.top)) / (canvasElement.width / 2)

  return {
    x,
    y
  }
}
