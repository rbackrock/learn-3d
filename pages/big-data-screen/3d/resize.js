import camera from './camera'
import renderer from './renderer'
import labelRenderer from './cssRenderer'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'
import unrealBloomRender from './postprocessing/unreal-bloom'

export default function resize() {
  const {
    canvas
  } = getCanvasWidthAndHeightAndSelf()
  
  const width = canvas.parentElement.offsetWidth
  const height = canvas.parentElement.offsetHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  labelRenderer.setSize(width, height)

  unrealBloomRender.setSize(width, height)
}
