import * as THREE from 'three'

const canvas = document.querySelector('#canvas-3d')
const width = canvas.offsetWidth
const height = canvas.offsetHeight

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000)
camera.aspect = width / height
camera.position.z = 10

export default camera
