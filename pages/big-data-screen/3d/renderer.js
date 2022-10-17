import * as THREE from "three"

const canvas = document.querySelector('#canvas-3d')
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

const renderer = new THREE.WebGLRenderer({
  canvas,
  // 抗锯齿
  antialias: true
})
renderer.setSize(canvas.width, canvas.height)

export default renderer