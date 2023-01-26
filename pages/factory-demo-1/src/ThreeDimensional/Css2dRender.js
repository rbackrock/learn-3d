import {
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import ThreeDimensional from './ThreeDimensional'

export default class Css2dRender {
  constructor() {
    this.threeDimensional = new ThreeDimensional()
    this.canvas = this.threeDimensional.canvas
    this.sizes = this.threeDimensional.sizes
    this.scene = this.threeDimensional.scene
    this.camera = this.threeDimensional.camera

    this.create()
  }

  create() {
    this.instance = new CSS2DRenderer()
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.canvas.parentElement.appendChild(this.instance.domElement)

    this.instance.domElement.style.position = 'absolute';
    this.instance.domElement.style.top = '0px';
    this.instance.domElement.style.left = '0px';
    // this.instance.domElement.style.zIndex = '9';
    this.instance.domElement.style.pointerEvents = 'none'
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}