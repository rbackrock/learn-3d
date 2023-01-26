import * as THREE from 'three'
import ThreeDimensional from '../ThreeDimensional'

export default class box {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.scene = this.threeDimensional.scene
    this.outLinePostprocessing = this.threeDimensional.outLinePostprocessing
    this.debug = this.threeDimensional.debug

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000
    })
    this.box = new THREE.Mesh(geometry, material)
    this.scene.add(this.box)

    this.outLinePostprocessing.outlinePass.selectedObjects = [this.box]

    this.setDebug()
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox')
      this.debugFolder.add(this.box.position, 'y')
    }
  }
}
