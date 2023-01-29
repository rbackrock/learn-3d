import * as THREE from 'three'
import ThreeDimensional from './ThreeDimensional'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export const cameraType = {
  STANDARD: 'standard_camera',
  TRACK_TRUCK_REAR: 'track_truck_rear_camera',
  TRACK_TRUCK_FLANK: 'track_truck_flank_camera'
}

export const viewType = {
  STANDARD: 'standard_view',
  MACHINE: 'machine_view'
}

export default class Camera {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.sizes = this.threeDimensional.sizes
    this.scene = this.threeDimensional.scene
    this.canvas = this.threeDimensional.canvas
    // 当前活动摄像机
    this.activeCamera = null
    // 当前活动摄像机的控制器，如果有的话
    this.activeControls = null
    this.cameraList = {
      // 默认结构格式如下
      // [typeName]: {
      //   camera: camera,
      //   controls: controls
      // }
    }

    // 当前活动摄像机
    this.setDefaultCamera()
    this.setActiveCamera(cameraType.STANDARD)

    // 默认相机的相机位置
    this.viewPostionList = {
      [viewType.STANDARD]: {
        x: this.activeCamera.position.x,
        y: this.activeCamera.position.y,
        z: this.activeCamera.position.z,
      },
      [viewType.MACHINE]: {
        x: 1.817,
        y: 38.321,
        z: -62.163
      }
    }
  }

  setDefaultCamera() {
    const defaultCamera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 10000)
    defaultCamera.position.set(-213.125, 62.492, 4.971)
    defaultCamera.name = cameraType.STANDARD
    this.scene.add(defaultCamera)

    // 默认相机拥有的控制器
    const controls = new OrbitControls(defaultCamera, this.canvas)
    controls.enableDamping = true
    // controls.maxPolarAngle = Math.PI / 180 * 75

    this.cameraList[cameraType.STANDARD] = {
      camera: defaultCamera,
      controls
    }
  }

  resize() {
    for (const cameraKey in this.cameraList) {
      const currentCamera = this.cameraList[cameraKey]
      currentCamera.camera.aspect = this.sizes.width / this.sizes.height
      currentCamera.camera.updateProjectionMatrix()
    }
  }

  update() {
    if (this.activeControls) {
      this.activeControls.update()
    }
  }

  /**
   * 设置活动摄像机
   * @param {String} cameraName 摄像机名称
   */
  setActiveCamera(cameraType) {
    this.activeCamera = this.cameraList[cameraType].camera
    this.activeControls = this.cameraList[cameraType].controls
  }

  /**
   * 添加额外摄像机，额外指比如 Blender 添加的摄像机
   * @param {String} cameraType 摄像机类型名称
   * @param {Object} camera 摄像机 Object3d 对象
   * @param {Object} controls 对用相机控制器对象
   */
  addExtraCamera(cameraType, camera, controls = null) {
    camera.aspect = this.sizes.width / this.sizes.height
    camera.updateProjectionMatrix()
    this.cameraList[cameraType] = {
      camera: camera,
      controls
    }
  }

  changeViewPosition(type) {
    const start = {
      x: this.activeCamera.position.x,
      y: this.activeCamera.position.y,
      z: this.activeCamera.position.z,
    }
    let end = {}

    if (type === viewType.STANDARD) {
      end = {
        x: this.viewPostionList[viewType.STANDARD].x,
        y: this.viewPostionList[viewType.STANDARD].y,
        z: this.viewPostionList[viewType.STANDARD].z,
      }
    } else if (type === viewType.MACHINE) {
      end = {
        x: this.viewPostionList[viewType.MACHINE].x,
        y: this.viewPostionList[viewType.MACHINE].y,
        z: this.viewPostionList[viewType.MACHINE].z,
      }
    }
    
    let animation = gsap.to(start, {
      ...end,
      duration: 0.9,
      ease: 'none',
      // repeat: 1,
      onUpdate: () => {
        this.activeCamera.position.set(start.x, start.y, start.z)
      },
      onComplete: () => {
        animation.kill()
        animation = null
      }
    })
  }

  destroy() {
    for (const cameraKey in this.cameraList) {
      const currentCamera = this.cameraList[cameraKey]
      if (currentCamera.controls) {
        currentCamera.controls.dispose()
      }
    }
  }
}