import * as draw from './draw'

const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 800
document.body.insertAdjacentElement('afterbegin', canvas)
const gl = canvas.getContext('webgl')

// draw.drawPoint(gl)
// draw.drawPointClick(gl)
// draw.drawTriangle(gl)
draw.translateTriangle(gl)
// draw.rotateTriangle(gl)
// draw.matrixRotateTriangle(gl)