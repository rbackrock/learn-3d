import * as THREE from 'three'
import ThreeDimensional from '../ThreeDimensional'

class Environment {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.scene = this.threeDimensional.scene
    this.resources = this.threeDimensional.resources

    // this.setEnvironmentMap()
    this.setLight()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.encoding = THREE.sRGBEncoding

    this.scene.background = environmentMap
    this.scene.environment = environmentMap
  }

  setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 6)
    light.position.set(0, 60, 0)
    this.scene.add(light)

    const helper = new THREE.DirectionalLightHelper(light, 6)
    this.scene.add(helper)

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper)
  }
}

export default Environment
