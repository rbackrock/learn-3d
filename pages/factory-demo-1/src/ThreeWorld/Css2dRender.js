import {
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import ThreeWorld from './ThreeWorld'

export default class Css2dRender {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.canvas = this.threeWorld.canvas
    this.sizes = this.threeWorld.sizes
    this.scene = this.threeWorld.scene
    this.camera = this.threeWorld.camera

    this.create()
  }

  create() {
    this.instance = new CSS2DRenderer()
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.canvas.parentElement.appendChild(this.instance.domElement)

    this.instance.domElement.style.position = 'absolute';
    this.instance.domElement.style.top = '0px';
    this.instance.domElement.style.left = '0px';
    this.instance.domElement.style.zIndex = '9';
    this.instance.domElement.style.pointerEvents = 'none'
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}