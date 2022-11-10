import * as THREE from 'three'
import {
  getCanvasWidthAndHeightAndSelf
} from '../helper'
import Basic from './Basic'
import loadResource from './resources'
import Warehouse from './mesh/Warehouse/index'
import Floor from './mesh/Floor/index'

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
    
    this.render()
    this.createHelper()

    loadResource().then(resource => {
      this.resource = resource

      const list = [
        {
          id: 1,
          roomNum: '1-1',
          roomName: '房间1'
        }
      ]
      const listGroupNum = 4

      // warehouse
      const tobaccoWarehouse = new Warehouse({
        model: this.resource.objectModel.warehouse,
        lineColor: 0x1e90ff,
        modelColor: 0x1e90ff,
        modelOpacity: 0.6
      })
      const tobaccoWarehouseMesh = tobaccoWarehouse.create()
      const {
        width,
        height
      } = tobaccoWarehouse.getLandSize()

      // floor
      const floor = new Floor({
        listData: list,
        groupNum: listGroupNum,
        warehouseWidth: width * 0.001,
        warehouseHeight: height * 0.001
      })
      const floorOfWarehouse = floor.create()
  
      this.scene.add(tobaccoWarehouseMesh)
      this.scene.add(floorOfWarehouse)
    })
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