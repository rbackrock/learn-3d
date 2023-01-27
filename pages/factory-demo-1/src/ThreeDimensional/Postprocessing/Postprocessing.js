import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

import ThreeDimensional from '../ThreeDimensional'

export default class Postprocessing {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.sizes = this.threeDimensional.sizes
    this.renderer = this.threeDimensional.renderer
    this.scene = this.threeDimensional.scene
    this.camera = this.threeDimensional.camera

    this.create()
  }

  create() {
    this.composer = new EffectComposer(this.renderer.instance)
    this.renderPass = new RenderPass(this.scene, this.camera.activeCamera)
    this.composer.addPass(this.renderPass)
    
    // 添加 OutLine 特效
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      this.scene,
      this.camera.activeCamera
    )
    this.composer.addPass(this.outlinePass)
  }

  resize() {
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update() {
    this.renderPass.camera = this.camera.activeCamera
    this.outlinePass.renderCamera = this.camera.activeCamera
    this.composer.render()
  }

  destroy() {
    this.outlinePass.dispose()
  }
}