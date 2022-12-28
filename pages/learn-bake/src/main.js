import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// 使用加载器提示
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
  document.querySelector('#loading').style.display = 'none'
}

// 材质加载器
const textureLoader = new THREE.TextureLoader(loadingManager)
// 模型压缩加载器
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('/draco/')
// 模型j卡再起
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * 纹理
 */
const bakedTexture = textureLoader.load('/learn-bake/bake.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * 烘焙材质
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })


gltfLoader.load('/learn-bake/learn-bake.glb', gltf => {
    gltf.scene.traverse((child) => {
      child.material = bakedMaterial
    })

    scene.add(gltf.scene)
  }
)

/**
 * 设备宽高
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  setCamera(camera, sizes)
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
setCamera(camera, sizes)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
// 阻尼
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

/**
 * 以 iPhone12 大概比划的相机位置
 */
function setCamera(camera, { width, height }) {
  if (width > height) {
    // 横屏
    camera.position.x = -3.8
    camera.position.y = 2.04
    camera.position.z = -3.59
  } else {
    // 竖屏
    camera.position.x = -10.6
    camera.position.y = 5.6
    camera.position.z = -10
  }
}

tick()