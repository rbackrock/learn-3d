import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function createWarehouse(scene) {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('/models/warehouse.glb', gltf => {
    gltf.scene.traverse(item => {
      console.log(item)
      if (item.type === 'Mesh') {
        item.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x00ffff)
        })
      }
    })

    scene.add(gltf.scene)
  })
}