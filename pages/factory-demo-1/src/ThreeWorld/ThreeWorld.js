/**
 * canvas 元素外面需要包裹一个父级以适应不同固定宽高的显示需求
 * 场景元素分为固定3d物体和操作3d物体，操作3d物体列表在 World 对象中的 controls 属性中
 * 控制元素需要 gsap 动画时，需要在对应该类实现 destroyGsap 方法用作释放资源使用
 */

import * as THREE from 'three'

import Debug from './Utils/Debug'
import Sizes from './Utils/Sizes'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import OutLinePostprocessing from './Postprocessing/OutLinePostprocessing'
import Css2dRender from './Css2dRender'

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
    this.sizes = new Sizes(this.canvas)
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    // 后期处理
    this.outLinePostprocessing = new OutLinePostprocessing()

    // css2drender
    this.css2dRender = new Css2dRender()

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
    this.css2dRender.resize()
  }

  update() {
    this.camera.update()
    // this.renderer.update()
    this.outLinePostprocessing.composer.render()
    this.css2dRender.update()
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