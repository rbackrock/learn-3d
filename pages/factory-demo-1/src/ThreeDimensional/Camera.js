import * as THREE from 'three'
import ThreeDimensional from './ThreeDimensional'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.sizes = this.threeDimensional.sizes
    this.scene = this.threeDimensional.scene
    this.canvas = this.threeDimensional.canvas

    this.setInstance()
    this.setControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 10000)
    this.instance.position.set(123.725, 82.483, 164.967)
    this.scene.add(this.instance)
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI / 180 * 75
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}