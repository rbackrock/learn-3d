import * as THREE from 'three'
import ThreeDimensional from '../ThreeDimensional'
import Environment from './Environment'
import {
  hasIncludeMeshName,
  convertObject3D
} from '../Utils/index'

import Truck from './Controls/Truck'

export default class World {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.scene = this.threeDimensional.scene
    this.resources = this.threeDimensional.resources

    // 准备需要控制的 object3d 对象
    this.controls = {
      truck: null
    }

    // 第三方使用变量
    this.truckPath = null

    this.createScene()
    this.runWorld()
  }

  createScene() {
    this.environment = new Environment()

    const gltf = this.resources.gltfModel
    const sceneItem = []
    const truckPathPoints = []
    gltf.scene.traverse(child => {
      // 路面
      if (hasIncludeMeshName(child.name, 'floor')) {
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
      if (hasIncludeMeshName(child.name, 'tree')) {
        const treeMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(treeMesh)
      }

      // 路灯
      if (hasIncludeMeshName(child.name, 'street-light')) {
        const lightMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(lightMesh)
      }

      // 叉车
      if (hasIncludeMeshName(child.name, 'forklift')) {
        const forkliftMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(forkliftMesh)
      }

      // 卡车
      if (hasIncludeMeshName(child.name, 'truck')) {
        sceneItem.push(child)
        this.controls.truck = new Truck(child)
      }

      // 通过自定义点绘制运动曲线
      if (hasIncludeMeshName(child.name, 'truck-path')) {
        truckPathPoints[child.userData.index - 1] = child.position
      }

      // 卡车所在的路面
      if (hasIncludeMeshName(child.name, 'road')) {
        sceneItem.push(child)
      }

      // 光
      if (child.name === 'sunlight1') {
        sceneItem.push(child)
      }

      if (child.name === 'sunlight2') {
        sceneItem.push(child)
      }

      if (child.name === 'sunlight3') {
        sceneItem.push(child)
      }

      // 建筑
      if (hasIncludeMeshName(child.name, 'building')) {
        sceneItem.push(child)
      }
    })

    // 添加 object3d 到场景中
    for (let item of sceneItem) {
      this.scene.add(item)
    }

    // 添加自定义点连成的曲线
    this.truckPath = new THREE.CatmullRomCurve3(truckPathPoints, true, 'catmullrom', 0.3)
  }

  runWorld() {
    this.controls.truck.run(this.truckPath)
  }
}
