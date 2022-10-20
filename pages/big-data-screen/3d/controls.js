import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'
import labelRenderer from './cssRenderer'

const {
  canvas
} = getCanvasWidthAndHeightAndSelf()
const controls = new OrbitControls(camera, labelRenderer.domElement)

controls.maxPolarAngle = Math.PI / 180 * 90

export default controls
