import * as THREE from 'three'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'

const {
  canvas
} = getCanvasWidthAndHeightAndSelf()
canvas.width = canvas.parentElement.offsetWidth
canvas.height = canvas.parentElement.offsetHeight

const renderer = new THREE.WebGLRenderer({
  canvas,
  // 抗锯齿
  antialias: true
})
renderer.setSize(canvas.width, canvas.height)

export default renderer