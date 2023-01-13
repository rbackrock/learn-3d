import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

import ThreeWorld from '../ThreeWorld'

export default class OutLinePostprocessing {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.renderer = this.threeWorld.renderer
    this.scene = this.threeWorld.scene
    this.camera = this.threeWorld.camera

    this.create()
  }

  create() {
    console.log(this.renderer)
    this.composer = new EffectComposer(this.renderer.instance)
    const renderPass = new RenderPass(this.scene, this.camera.instance)
    this.composer.addPass(renderPass)

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera.instance
    )
    this.composer.addPass(this.outlinePass)
  }
}