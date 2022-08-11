import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import basicVertextShader from './shader/raw/vertex.glsl'
import basicFragmentShader from './shader/raw/fragment.glsl'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight
camera.position.z = 5

const controls = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// -----------------
const texture = new THREE.TextureLoader().load('/images/ca.jpeg')
const rowShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: basicVertextShader,
  fragmentShader: basicFragmentShader,
  // wireframe: true,
  side: THREE.DoubleSide,
  // transparent: true,
  uniforms: {
    uTime: {
      value: 0
    },
    uTexture: {
      value: texture
    }
  }
})

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 64, 64),
  rowShaderMaterial
)
scene.add(floor)
// -----------------

function render(time) {
  renderer.render(scene, camera)
  controls.update()
  rowShaderMaterial.uniforms.uTime.value = time / 1000

  requestAnimationFrame(render)
}

requestAnimationFrame(render)