import * as THREE from 'three'
import EventEmitter from './Utils/EventEmitter'
import ThreeDimensional from './ThreeDimensional'

export default class Renderer extends EventEmitter {
  constructor() {
    super()

    this.threeDimensional = new ThreeDimensional()
    this.canvas = this.threeDimensional.canvas
    this.sizes = this.threeDimensional.sizes
    this.scene = this.threeDimensional.scene
    this.camera = this.threeDimensional.camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      // logarithmicDepthBuffer: true,
      alpha: true
    })
    // this.instance.physicallyCorrectLights = true
    // this.instance.outputEncoding = THREE.sRGBEncoding
    // this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.toneMappingExposure = 1.75
    // this.instance.shadowMap.enabled = true
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
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
    this.instance.render(this.scene, this.camera.activeCamera)
  }

  destroy() {
    this.instance.dispose()
  }
}