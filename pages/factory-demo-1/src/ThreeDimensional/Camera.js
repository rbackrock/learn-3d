import * as THREE from 'three'
import ThreeDimensional from './ThreeDimensional'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const cameraType = {
  STANDARD: 'standard',
  TRACK_TRUCK: 'track_truck'
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
      // },
      [cameraType.STANDARD]: this.setDefaultCamera()
    }

    // 当前活动摄像机
    this.setActiveCamera(cameraType.STANDARD)
  }

  setDefaultCamera() {
    const defaultCamera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 10000)
    defaultCamera.position.set(123.725, 82.483, 164.967)
    defaultCamera.name = cameraType.STANDARD
    this.scene.add(defaultCamera)

    // 默认相机拥有的控制器
    const controls = new OrbitControls(defaultCamera, this.canvas)
    controls.enableDamping = true
    controls.maxPolarAngle = Math.PI / 180 * 75

    return {
      camera: defaultCamera,
      controls
    }
  }

  resize() {
    this.activeCamera.aspect = this.sizes.width / this.sizes.height
    this.activeCamera.updateProjectionMatrix()
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
    this.cameraList[cameraType] = {
      camera: camera,
      controls
    }
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