import * as THREE from 'three'

import Debug from './Utils/Debug'
import Sizes from './Utils/Sizes'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import OutLinePostprocessing from './Postprocessing/OutLinePostprocessing'

let instance = null

export class ThreeWorld {
  constructor(_canvas, sources) {
    if (instance) {
      return instance
    }

    // 设置 3d 场景实例
    instance = this

    // 设置 canvas
    this.canvas = _canvas

    // debug
    this.debug = new Debug()

    // 设置 3d 所需的实例
    this.resources = sources
    this.sizes = new Sizes()
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    // 后期处理
    this.outLinePostprocessing = new OutLinePostprocessing()

    // world
    this.wolrd = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.renderer.on('timeLoop', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    // this.renderer.update()
    this.outLinePostprocessing.composer.render()
  }

  destroy() {
    this.sizes.off('resize')
    this.renderer.off('timeLoop')

    this.scene.traverse(child => {
      if (child.geometry) {
        child.geometry.dispose()
      }

      for(const key in child.material) {
        const value = child.material[key]

        if (value && typeof value.dispose === 'function') {
          value.dispose()
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) {
      this.debug.ui.destroy()
    }

    // 删除并且置空控制物体的 gsap 动画对象让垃圾回收
    // ES 类规范没有接口特性，需要清除 gsap 动画需要实现 destroyGsap 方法
    for (const k in this.wolrd.controls) {
      this.wolrd.controls[k].destroyGsap && this.wolrd.controls[k].destroyGsap()
    }
  }
}

export default ThreeWorld