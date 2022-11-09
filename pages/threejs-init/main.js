import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight
camera.position.z = 10

const controls = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5)

scene.add(axesHelper)

const geometry = new THREE.CylinderGeometry( 1, 1, 1, 32 )
const material = new THREE.MeshBasicMaterial( {color: 0xffff00} )
const cylinder = new THREE.Mesh( geometry, material )
scene.add( cylinder )

const objLoader = new OBJLoader();
objLoader.load('/models/test/4.obj', (root) => {
  // console.log(root)
  root.traverse(child => {
    if (child.isMesh) {
      const edges = new THREE.EdgesGeometry(child.geometry)
      const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#1E90FF' }))
      lines.scale.set(0.003, 0.003, 0.003)
      scene.add(lines);

      const t1 = new THREE.MeshBasicMaterial({
        color: 0x1E90FF,
        opacity: 0.6,
      transparent: true
      })
      const z = new THREE.Mesh(child.geometry, t1)
      z.scale.set(0.003, 0.003, 0.003)
      console.log(z)
      scene.add(z)
    }
  })
  scene.add(root);
});

function render() {
  renderer.render(scene, camera)
  controls.update()

  requestAnimationFrame(render)
}

requestAnimationFrame(render)