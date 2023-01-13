import * as THREE from 'three'
import ThreeWorld from '../ThreeWorld'

export default class box {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.scene = this.threeWorld.scene
    this.debug = this.threeWorld.debug

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000
    })
    this.box = new THREE.Mesh(geometry, material)
    this.scene.add(this.box)

    this.setDebug()
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox')
      this.debugFolder.add(this.box.position, 'y')
    }
  }
}
