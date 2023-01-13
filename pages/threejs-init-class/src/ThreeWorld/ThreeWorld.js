import * as THREE from 'three'

import Debug from './Utils/Debug'
import Sizes from './Utils/Sizes'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources.js'

import sources from './sources.js'

let instance = null

export class ThreeWorld {
  constructor(_canvas) {
    if (instance) {
      return instance
    }

    // 设置 3d 场景实例
    instance = this
    window.threeWorld = this

    // 设置 canvas
    this.canvas = _canvas

    // debug
    this.debug = new Debug()

    // 设置 3d 所需的实例
    this.resources = new Resources(sources)
    this.sizes = new Sizes()
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

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
    this.renderer.update()
  }

  destroy() {
    this.sizes.off('resize')

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        for(const key in child.material) {
          const value = child.material[key]

          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) {
      this.debug.ui.destroy()
    }
  }
}

export default ThreeWorld