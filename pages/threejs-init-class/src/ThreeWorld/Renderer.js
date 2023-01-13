import * as THREE from 'three'
import EventEmitter from './Utils/EventEmitter'
import ThreeWorld from './ThreeWorld'

export default class Renderer extends EventEmitter {
  constructor() {
    super()

    this.threeWorld = new ThreeWorld()
    this.canvas = this.threeWorld.canvas
    this.sizes = this.threeWorld.sizes
    this.scene = this.threeWorld.scene
    this.camera = this.threeWorld.camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

    this.instance.setAnimationLoop(() => {
      this.trigger('timeLoop')
    })
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}