import * as THREE from 'three'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'

const {
  canvas
} = getCanvasWidthAndHeightAndSelf(document.querySelector('#canvas-3d-hook'))
canvas.width = canvas.parentElement.offsetWidth
canvas.height = canvas.parentElement.offsetHeight

const renderer = new THREE.WebGLRenderer({
  canvas,
  // 抗锯齿
  antialias: true,
  alpha: false
})
renderer.setSize(canvas.width, canvas.height)

export default renderer