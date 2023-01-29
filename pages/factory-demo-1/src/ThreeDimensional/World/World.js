import * as THREE from 'three'

import EventEmitter from '../Utils/EventEmitter'
import gsap from 'gsap'
import ThreeDimensional from '../ThreeDimensional'
import Environment from './Environment'
import {
  hasIncludeImportMeshName,
  importMeshLastName,
  convertObject3D,
  covertMousePositionToNDC
} from '../Utils/index'

import Truck from './Controls/Truck/index'
import Machine from './Controls/Machine/index'
import Building1 from './Controls/Building1/index'
import Building2 from './Controls/Building2/index'
import Building3 from './Controls/Building3/index'
import Forklift2 from './Controls/Forklift2/index'
import FlyLine from './Controls/FlyLine'

export default class World extends EventEmitter {
  constructor() {
    super()

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
      machine: null,
      building1: null,
      building2: null,
      building3: null,
      forklift2: null,
      flyLine: null
    }

    // 第三方使用变量
    this.truckPath = null

    this.createScene()
    this.run()

    // 绑定事件函数
    this.pointMoveHandler = this.pointMoveHandler.bind(this)
    this.pointClickHandler = this.pointClickHandler.bind(this)
    this.bindEvent()

    // 接收 destroy 事件
    this.on('destroy', () => {
      this.destroy()
    })
  }

  createScene() {
    this.environment = new Environment()

    const gltf = this.resources.gltfModel
    const sceneItem = []

    // 卡车路径点
    const truckPathPoints = []

    // 飞线需要的三个点
    const flyLineVector3List = []

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
        if (importMeshLastName(child.name) === '1' || importMeshLastName(child.name) === '3') {
          sceneItem.push(child)
        } else {
          this.controls.forklift2 = new Forklift2(child)
          sceneItem.push(this.controls.forklift2.mesh)
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

      // 飞线
      if (hasIncludeImportMeshName(child.name, 'fly-line')) {
        const meshLastName = importMeshLastName(child.name)
        if (meshLastName === 'start') {
          flyLineVector3List[0] = child.position.clone()
        } else if (meshLastName === 'peak') {
          flyLineVector3List[1] = child.position.clone()
        } else if (meshLastName === 'end') {
          flyLineVector3List[2] = child.position.clone()
        }
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
        const meshNameNumber = importMeshLastName(child.name)
        if (meshNameNumber === '1') {
          sceneItem.push(child)
          this.controls.building1 = new Building1(child)
        } else if (meshNameNumber === '2') {
          sceneItem.push(child)
          this.controls.building2 = new Building2(child)
        } else if (meshNameNumber === '3') {
          sceneItem.push(child)
          this.controls.building3 = new Building3(child)
        } else {
          sceneItem.push(child)
        }
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

    // 创建飞线
    this.controls.flyLine = new FlyLine(flyLineVector3List)
    this.scene.add(this.controls.flyLine.create())
  }

  run() {
    this.controls.truck.run(this.truckPath)
  }

  pointMoveHandler(evt) {
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

  pointClickHandler(evt) {
    const raycaster = new THREE.Raycaster()
    const mousePositionNDC = covertMousePositionToNDC(this.sizes.width, this.sizes.height, evt.clientX, evt.clientY)
    raycaster.setFromCamera(mousePositionNDC, this.camera.activeCamera)
    const intersects = raycaster.intersectObjects(this.scene.children, true)
    let currentClickMesh = null

    if ((intersects[0]?.object?.name || '').indexOf('machine') !== -1) {
      currentClickMesh = this.controls.machine.mesh
    } else if ((intersects[0]?.object?.name || '').indexOf('building') !== -1) {
      if (intersects.length > 0) {
        currentClickMesh = intersects[0].object
      }
    } else if ((intersects[0]?.object?.name || '').indexOf('forklift') !== -1) {
      if (intersects.length > 0) {
        currentClickMesh = intersects[0].object
      }
    }

    if (currentClickMesh) {
      document.querySelector('#click-box-hook').innerHTML = `当前点击的3D物体的name值为：${currentClickMesh.name}`
      const animation = gsap.to('#click-box-hook', {
        duration: 1.9,
        onStart: () => {
          document.querySelector('#click-box-hook').style.display = 'block'
          this.canvas.removeEventListener('click', this.pointClickHandler)
        },
        onComplete: () => {
          document.querySelector('#click-box-hook').style.display = 'none'
          animation.kill()
          this.canvas.addEventListener('click', this.pointClickHandler)
        }
      })
    }
  }
  
  bindEvent() {
    this.canvas.addEventListener('pointermove', this.pointMoveHandler)
    this.canvas.addEventListener('click', this.pointClickHandler)
  }

  removeEvent() {
    this.canvas.removeEventListener('pointermove', this.pointMoveHandler)
    this.canvas.removeEventListener('click', this.pointClickHandler)
  }

  destroy() {
    this.removeEvent()

    // 删除并且置空控制物体的 gsap 动画对象让垃圾回收，或者其他事件对象
    // ES 类规范没有接口特性，需要清除 gsap 动画需要自己记得实现 destroy 方法
    for (const wolrdControlsKey in this.controls) {
      this.controls[wolrdControlsKey].destroy && this.controls[wolrdControlsKey].destroy()
    }
  }
}
