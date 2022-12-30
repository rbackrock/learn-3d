import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

const gui = new dat.GUI()
const speed = {
  rate: 1,

}
gui
  .add(speed, 'rate')
  .min(0.3)
  .max(2)
  .step(0.01)
  .name('传送带速度')

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
  document.querySelector('#loading').style.display = 'none'
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper)

const gltfLoader = new GLTFLoader(loadingManager)

const loader = new THREE.TextureLoader(loadingManager);
// const texture = loader.load('/conveyor-belt/conveyor-belt-texture.png')
const texture = loader.load('http://cdn.rback.fun/conveyor-belt/conveyor-belt-texture.png')
texture.wrapS = THREE.MirroredRepeatWrapping
texture.wrapT = THREE.MirroredRepeatWrapping

const metal = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide
});

const boxList = []

// gltfLoader.load('/conveyor-belt/conveyor-belt.glb', gltf => {
gltfLoader.load('http://cdn.rback.fun/conveyor-belt/conveyor-belt.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.type === 'Mesh') {
      if (child.name === 'belt') {
        child.material = metal
      }

      // 这是 blender 对所有箱子设置的自定义属性，用来标识所有箱子几何体
      if (child.userData && child.userData.box === 1) {
        boxList.push(child)
      }
    }
  })

  scene.add(gltf.scene)
})

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
})

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5.14
camera.position.y = 5.98
camera.position.z = 11.03
scene.add(camera)

const color = 0xFFFFFF;
const intensity = 1.8;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(3, 6, 11);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
renderer.setAnimationLoop(() => {
  const elapsedTime = clock.getElapsedTime()
  controls.update()

  // 移动传送带
  metal.map.offset.y = metal.map.offset.y - 0.001 * speed.rate

  // 移动传送带上的箱子
  for (const box of boxList) {
    if (box.position.x > 5.33) {
      box.position.x = -4.208
    } else {
      box.position.x = box.position.x + 0.03 * speed.rate
    }
  }

  // 移动传送带上的箱子
	renderer.render(scene, camera);
})