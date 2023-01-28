import * as THREE from 'three'
import ThreeDimensional from '../ThreeDimensional'
import Environment from './Environment'
import {
  hasIncludeImportMeshName,
  importMeshNameNumber,
  convertObject3D,
  covertMousePositionToNDC
} from '../Utils/index'

import Truck from './Controls/Truck'
import Machine from './Controls/Machine'

export default class World {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.canvas = this.threeDimensional.canvas
    this.camera = this.threeDimensional.camera
    this.scene = this.threeDimensional.scene
    this.sizes = this.threeDimensional.sizes
    this.outlinePass = this.threeDimensional.outlinePass 
    this.resources = this.threeDimensional.resources

    // 准备需要控制的 object3d 对象
    this.controls = {
      truck: null,
      machine: null
    }

    // 第三方使用变量
    this.truckPath = null

    this.createScene()
    this.run()

    // 绑定事件函数
    this.pointMoveHandler = this.pointMoveHandlerFunc.bind(this)
    this.bindEvent()
  }

  createScene() {
    this.environment = new Environment()

    const gltf = this.resources.gltfModel
    const sceneItem = []
    const truckPathPoints = []

    // 添加额外摄像机
    for (const camera of gltf.cameras) {
      this.camera.addExtraCamera(camera.name, camera)
    }

    gltf.scene.traverse(child => {
      // 路面
      if (hasIncludeImportMeshName(child.name, 'floor')) {
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
      if (hasIncludeImportMeshName(child.name, 'tree')) {
        sceneItem.push(child)
      }

      // 路灯
      if (hasIncludeImportMeshName(child.name, 'street-light')) {
        const lightMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(lightMesh)
      }

      // 叉车
      if (hasIncludeImportMeshName(child.name, 'forklift')) {
        if (importMeshNameNumber(child.name) === '1' || importMeshNameNumber(child.name) === '3') {
          sceneItem.push(child)
        } else {
          const forkliftMesh = convertObject3D(child, object3d => {
            const edges = new THREE.EdgesGeometry(object3d.geometry)
            const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))
  
            return lines
          })
  
          sceneItem.push(forkliftMesh)
        }
      }

      // 卡车
      if (hasIncludeImportMeshName(child.name, 'truck')) {
        sceneItem.push(child)
        this.controls.truck = new Truck(child)
      }

      // 通过自定义点绘制运动曲线
      if (hasIncludeImportMeshName(child.name, 'truck-path')) {
        truckPathPoints[child.userData.index - 1] = child.position
      }

      // 卡车所在的路面
      if (hasIncludeImportMeshName(child.name, 'road')) {
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

      // 添加路障
      if (hasIncludeImportMeshName(child.name, 'roadblock')) {
        sceneItem.push(child)
      }

      // 建筑
      if (hasIncludeImportMeshName(child.name, 'building')) {
        sceneItem.push(child)
      }

      // 中央机器
      if (child.name === 'machine') {
        this.controls.machine = new Machine(child)
        sceneItem.push(this.controls.machine.mesh)
      }
    })

    // 添加 object3d 到场景中
    for (let item of sceneItem) {
      this.scene.add(item)
    }

    // 添加自定义点连成的曲线
    this.truckPath = new THREE.CatmullRomCurve3(truckPathPoints, true, 'catmullrom', 0.3)
  }

  run() {
    this.controls.truck.run(this.truckPath)
  }

  pointMoveHandlerFunc(evt) {
    const raycaster = new THREE.Raycaster()
    const mousePositionNDC = covertMousePositionToNDC(this.sizes.width, this.sizes.height, evt.clientX, evt.clientY)
    raycaster.setFromCamera(mousePositionNDC, this.camera.activeCamera)
    const intersects = raycaster.intersectObjects(this.scene.children, true)

    // hover 中央机器
    if ((intersects[0]?.object?.name || '').indexOf('machine') !== -1) {
      // 设置高亮
      this.outlinePass.selectedObjects = [this.controls.machine.mesh]
      // 显示中央机器标签
      this.controls.machine.setLabelVisible(true)
      // 显示hover状态
      document.querySelector('#hover-mesh-hook').innerHTML = '中央机器'
      document.querySelector('#hover-mesh-3d-name-hook').innerHTML = this.controls.machine.mesh.name

      return
    }
    this.controls.machine.setLabelVisible(false)

    // hover 建筑物
    if ((intersects[0]?.object?.name || '').indexOf('building') !== -1) {
      if (intersects.length > 0) {
        this.outlinePass.selectedObjects = [intersects[0].object]
        // 显示hover状态
        document.querySelector('#hover-mesh-hook').innerHTML = '建筑物'
        document.querySelector('#hover-mesh-3d-name-hook').innerHTML = intersects[0].object.name
      }

      return
    }

    // hover 叉车
    if ((intersects[0]?.object?.name || '').indexOf('forklift') !== -1) {
      if (intersects.length > 0) {
        this.outlinePass.selectedObjects = [intersects[0].object]
        // 显示hover状态
        document.querySelector('#hover-mesh-hook').innerHTML = '叉车'
        document.querySelector('#hover-mesh-3d-name-hook').innerHTML = intersects[0].object.name
      }

      return
    }

    this.outlinePass.selectedObjects = []
    // 显示hover状态
    document.querySelector('#hover-mesh-hook').innerHTML = ''
    document.querySelector('#hover-mesh-3d-name-hook').innerHTML = ''
  }
  
  bindEvent() {
    this.canvas.addEventListener('pointermove', this.pointMoveHandler)
  }

  removeEnent() {
    this.canvas.removeEventListener('pointermove', this.pointMoveHandler)
  }

  destroy() {
    this.removeEnent()
  }
}
