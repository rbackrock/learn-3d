import * as THREE from 'three'
import _ from 'lodash'
import {
  getGroupChunkArrayDetail
} from '../../../helper'

export default class Floor {
  constructor({ listData, groupNum, warehouseWidth, warehouseHeight, gap = 3 }) {
    this.listData = listData
    this.groupNum = groupNum
    this.warehouseWidth = warehouseWidth
    this.warehouseHeight = warehouseHeight
    this.gap = gap
  }

  create() {
    const color = 0x0e8ff8 // 0x2b4dff 0x0c0e6f 0x1dc7ff 0xa0d7e9
    const list = _.chunk(this.listData, this.groupNum)
    const {
      maxCol, // 当作表格来看待，对整体来讲最大的列
      maxRows // 当作表格来看待，对整体来讲最大的行
    } = getGroupChunkArrayDetail(list, this.groupNum)
    let maxCount = maxCol
    let maxSize = this.warehouseWidth
    const redundancyTotal = 3

    if (maxRows > maxCount) {
      maxCount = maxRows
      maxSize = this.warehouseHeight
    }

    const floorSize = maxSize * (maxCount + redundancyTotal) + this.gap * (maxCount - 1)

    const grid = new THREE.GridHelper(
      floorSize,
      maxCount * 10,
      color,
      color
    )
    const geometry = new THREE.PlaneGeometry(
      floorSize,
      floorSize,
    )
    geometry.rotateX(Math.PI / 180 * 90)
    const material = new THREE.MeshBasicMaterial({
      color: 0x0c0e6f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    })
    const plane = new THREE.Mesh(geometry, material)

    const floor = new THREE.Group()
    floor.add(grid)
    floor.add(plane)

    return floor
  }
}