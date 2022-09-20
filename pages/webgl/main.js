import * as drawBase from './draw-base'
import * as drawTexture from './draw-texture'
import * as draw3d from './draw-3d'

const canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 800
canvas.height = 800
document.body.insertAdjacentElement('afterbegin', canvas)
const gl = canvas.getContext('webgl')

// drawBase.drawPoint(gl)
// drawBase.drawPointClick(gl)
// drawBase.drawTriangle(gl)
// drawBase.translateTriangle(gl)
// drawBase.rotateTriangle(gl)
// drawBase.matrixRotateTriangle(gl)
// drawBase.matrixRotateTriangleLib(gl)
// drawBase.matrixRotateAndTranslateTriangleLib(gl)
// drawBase.animateRotateTriangle(gl)

// drawTexture.multiAttributeSize(gl)
// drawTexture.multiAttributeSizeInterleaved(gl)
// drawTexture.multiAttributeColor(gl)
// drawTexture.textureQuad(gl)
// drawTexture.multiTexture(gl)

// draw3d.lootAtTriangle(gl)
// draw3d.lootAtRotatedTriangle(gl)
// draw3d.lootAtRotatedTriangleMvMatrix(gl)
// draw3d.lootAtTriangleWithKeys(gl)
// draw3d.orthView(gl)
// draw3d.perspectiveView(gl, canvas)
// draw3d.helloCube(gl)
draw3d.colorCube(gl)