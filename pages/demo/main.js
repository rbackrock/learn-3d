import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

const sphereGeometry = new THREE.SphereBufferGeometry(3, 20, 20)
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1
})
const points = new THREE.Points(sphereGeometry, pointMaterial)

scene.add(points)

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  controls.update()
})