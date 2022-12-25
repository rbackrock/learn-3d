import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

const cubeTextureLoader = new THREE.CubeTextureLoader()

// const gui = new dat.GUI()
const debugObject = {}

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

const environmentMap = cubeTextureLoader.load([
    '/exercise1/textures/environmentMaps/0/px.jpg',
    '/exercise1/textures/environmentMaps/0/nx.jpg',
    '/exercise1/textures/environmentMaps/0/py.jpg',
    '/exercise1/textures/environmentMaps/0/ny.jpg',
    '/exercise1/textures/environmentMaps/0/pz.jpg',
    '/exercise1/textures/environmentMaps/0/nz.jpg'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5
// gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

gltfLoader.load(
    '/exercise1/donut.glb',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, - 4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5

        // ---
        // gltf.scene.traverse(mesh => {
        //   if (mesh.isMesh) {
        //     mesh.material.emissive =  mesh.material.color;
        //     mesh.material.emissiveMap = mesh.material.map ;
        //   }
        // })
        // ---

        scene.add(gltf.scene)

        // gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
    }
)

// gltfLoader.load(
//     '/models/hamburger.glb',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(0.3, 0.3, 0.3)
//         gltf.scene.position.set(0, - 1, 0)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(5, 5, - 2.25)
scene.add(directionalLight)

// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
// gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300)
camera.position.set(20, 3, - 1)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.9
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// gui
//     .add(renderer, 'toneMapping', {
//         No: THREE.NoToneMapping,
//         Linear: THREE.LinearToneMapping,
//         Reinhard: THREE.ReinhardToneMapping,
//         Cineon: THREE.CineonToneMapping,
//         ACESFilmic: THREE.ACESFilmicToneMapping
//     })
// gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

const tick = () => {
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()