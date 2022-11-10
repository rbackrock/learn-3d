import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  getCanvasWidthAndHeightAndSelf
} from '../helper'

export default class Basic {
  constructor(containerElement) {
    this.canvas = this.initCanvasElement(containerElement)
    this.buildScenes()
    this.setControls()
  }

  initCanvasElement(containerElement) {
    const parentCanvasDom = containerElement.parentElement
    containerElement.width = parentCanvasDom.offsetWidth
    containerElement.height = parentCanvasDom.offsetHeight

    return containerElement
  }

  buildScenes() {
    const {
      width,
      height
    } = getCanvasWidthAndHeightAndSelf(this.canvas)

    // scene
    this.scene = new THREE.Scene()
    // camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000)
    this.camera.aspect = width / height
    this.camera.position.set(5, 10, 15)
    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: false, // 透明
      antialias: true, // 抗锯齿
    })
    this.renderer.setPixelRatio(window.devicePixelRatio); // 设置屏幕像素比
    this.renderer.setSize(width, height)
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotateSpeed = 3
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    this.controls.enableDamping = true;
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    this.controls.dampingFactor = 0.05;
    // 是否可以缩放
    this.controls.enableZoom = true;
    // 设置相机距离原点的最远距离
    this.controls.minDistance = 0;
    // 设置相机距离原点的最远距离
    this.controls.maxDistance = Infinity;
    // 是否开启右键拖拽
    this.controls.enablePan = true;
  }
}