import camera from './camera'
import renderer from './renderer'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'

export default function resize() {
  const {
    canvas
  } = getCanvasWidthAndHeightAndSelf(document.querySelector('#canvas-3d-hook'))
  
  const width = canvas.parentElement.offsetWidth
  const height = canvas.parentElement.offsetHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
}
