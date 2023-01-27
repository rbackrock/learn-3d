import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

import ThreeDimensional from '../ThreeDimensional'

export default class OutLinePostprocessing {
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
    const renderPass = new RenderPass(this.scene, this.camera.activeCamera)
    this.composer.addPass(renderPass)

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      this.scene,
      this.camera.activeCamera
    )
    this.composer.addPass(this.outlinePass)
  }

  resize() {
    this.composer.setSize(this.sizes.width, this.sizes.height)
  }

  update() {
    this.composer.render()
  }
}