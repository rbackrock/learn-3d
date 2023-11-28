import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(3)
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight
camera.position.z = 10

const controls = new OrbitControls(
  camera,
  renderer.domElement
)
const axesHelper = new THREE.AxesHelper(3)

scene.add(axesHelper)

// ---
const geometry = new THREE.BufferGeometry()
const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 9
})
const vertices = new Float32Array(7 * 7 * 3)

const rows = 3
const col = 3
for (let i = -rows, countIndex = -1; i <= rows; i++) {
  for (let n = -col; n <= col; n++) {
    vertices[countIndex += 1] = i
    vertices[countIndex += 1] = 3
    vertices[countIndex += 1] = n
  }
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const points = new THREE.Points(geometry, material)

scene.add(points)

// ---

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  controls.update()
})
