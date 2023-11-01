import * as THREE from 'three'
import ThreeDimensional from '../ThreeDimensional'

class Environment {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.scene = this.threeDimensional.scene
    this.resources = this.threeDimensional.resources

    // this.setEnvironmentMap()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.colorSpace = THREE.SRGBColorSpace

    this.scene.background = environmentMap
    this.scene.environment = environmentMap
  }
}

export default Environment
