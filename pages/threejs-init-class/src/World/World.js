import * as THREE from 'three'
import {
  getCanvasWidthAndHeightAndSelf
} from '../helper'
import Basic from './Basic'

export default class World {
  constructor({
    containerElement
  }) {
    this.basic = new Basic(containerElement)
    this.canvas = this.basic.canvas
    this.scene = this.basic.scene
    this.renderer = this.basic.renderer
    this.controls = this.basic.controls
    this.camera = this.basic.camera

    const geometry = new THREE.BoxGeometry( 1, 1, 1 )
    const material = new THREE.MeshBasicMaterial({color: 0xffff00})
    const cylinder = new THREE.Mesh( geometry, material )
    this.scene.add( cylinder )

    this.createHelper()
    this.render()
  }

  render() {
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.basic.scene, this.basic.camera)
    this.controls.update()
  }

  resize() {
    const {
      canvas
    } = getCanvasWidthAndHeightAndSelf(this.canvas)

    const width = canvas.parentElement.offsetWidth
    const height = canvas.parentElement.offsetHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }

  createHelper() {
    const axesHelper = new THREE.AxesHelper(3)
    this.scene.add(axesHelper)
  }
}