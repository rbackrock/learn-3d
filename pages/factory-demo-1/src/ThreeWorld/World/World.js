import * as THREE from 'three'
import ThreeWorld from '../ThreeWorld'
import Environment from './Environment'
import {
  hasIncludeMeshName,
  convertObject3D
} from '../Utils/index'

export default class World {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.scene = this.threeWorld.scene
    this.resources = this.threeWorld.resources

    this.lineColor = 0x1e90ff

    this.resources.on('load', () => {
      this.createScene()
    })
  }

  createScene() {
    this.environment = new Environment()

    const gltf = this.resources.items.gltfModel
    const sceneItem = []
    console.log(gltf)
    gltf.scene.traverse(child => {
      // 路面
      if (hasIncludeMeshName(child.name, 'floor#')) {
        child.geometry.computeBoundingBox()
        const {
          min,
          max
        } = child.geometry.boundingBox
        const gridHelper = new THREE.GridHelper(Math.abs(min.x) + Math.abs(max.x), 40, new THREE.Color(0x0e8ff8), new THREE.Color(0x0e8ff8))
        sceneItem.push(gridHelper)

        const floorColor = 0x0c0e6f
        const floorGeometry = child.geometry
        const floorMaterial = new THREE.MeshBasicMaterial({
          color: floorColor,
          transparent: true,
          opacity: 0.6
        })
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
        sceneItem.push(floorMesh)
      }

      // 树
      if (hasIncludeMeshName(child.name, 'tree#')) {
        const treeMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(treeMesh)
      }

      // 路灯
      if (hasIncludeMeshName(child.name, 'street-light#')) {
        const lightMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(lightMesh)
      }

      // 叉车
      if (hasIncludeMeshName(child.name, 'forklift#')) {
        const forkliftMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(forkliftMesh)
      }

      // 卡车
      if (hasIncludeMeshName(child.name, 'truck#')) {
        sceneItem.push(child)
      }

      // 卡车所在的路面
      if (hasIncludeMeshName(child.name, 'road#')) {
        sceneItem.push(child)
      }
    })

    for (let item of sceneItem) {
      this.scene.add(item)
    }
  }
}
