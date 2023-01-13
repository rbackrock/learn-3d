import * as THREE from 'three'
import ThreeWorld from '../ThreeWorld'

class Environment {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.scene = this.threeWorld.scene
    this.resources = this.threeWorld.resources

    this.setEnvironmentMap()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.encoding = THREE.sRGBEncoding

    this.scene.background = environmentMap
    this.scene.environment = environmentMap
  }
}

export default Environment
