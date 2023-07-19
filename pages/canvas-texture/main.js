import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import drawLabel from './draw-label'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight
camera.position.z = 10

const controls = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper)

console.log(drawLabel());
drawLabel().then(data => {
  const texture = new THREE.TextureLoader().load(data)
  const geometry = new THREE.PlaneGeometry(12, 6)
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture
  })
  const plane = new THREE.Mesh(geometry, material)
  scene.add(plane);
})

function render() {
  renderer.render(scene, camera)
  controls.update()

  requestAnimationFrame(render)
}

requestAnimationFrame(render)

