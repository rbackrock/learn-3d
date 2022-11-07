import * as THREE from 'three'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'

const {
  canvas
} = getCanvasWidthAndHeightAndSelf(document.querySelector('#canvas-3d-hook'))
const width = canvas.offsetWidth
const height = canvas.offsetHeight

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000)
camera.aspect = width / height
// camera.position.set(5, 10, 15)
camera.position.set(0, 30, -160)

export default camera
