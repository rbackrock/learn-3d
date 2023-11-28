import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight
camera.position.z = 10

const controls = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper)

// ---------------------------------
const loadingManager = new THREE.LoadingManager()
// draco
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('/draco/')
dracoLoader.preload()
// 模型加载器
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)
// texture
const textureLoader = new THREE.TextureLoader(loadingManager)
const bakedTexture = textureLoader.load('/experiment/bake.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

gltfLoader.load('/experiment/models/test.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.material) {
      child.material = bakedMaterial
    }
  })

  scene.add(gltf.scene)
})
// ---------------------------------

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  controls.update()
})