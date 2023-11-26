import * as THREE from 'three'
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight
camera.position.set(
  9,9,9
)

const controls = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper)

// ---------------------------------
function pointification(mesh, amount){
  let mss = new MeshSurfaceSampler(mesh).build();
  let pointsData = [];
  let v = new THREE.Vector3();
  for(let i = 0; i < amount; i++){
    mss.sample(v);
    v.toArray(pointsData, i * 3);
  }
  return new THREE.Float32BufferAttribute(pointsData, 3);
}

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(9, 9, 9),
  new THREE.MeshBasicMaterial({
    color: 0xffffff
  })
)

let amount = 50000
let pointGeometry = new THREE.BufferGeometry()
pointGeometry.setAttribute("position", pointification(cube, amount))

scene.add(
  new THREE.Points(
    pointGeometry,
    new THREE.PointsMaterial({
      color: 0x44ffff,
      size: 0.003
    })
  )
)

// ---------------------------------

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  controls.update()
})