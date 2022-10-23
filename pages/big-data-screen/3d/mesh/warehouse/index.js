import * as THREE from 'three'
import {
  OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader'
import modifyShader from './shader'
import makeWarehouseLabel from './makeLabel'
import {
  getGroupChunkArrayDetail
} from '../../helper'
import _ from 'lodash'

export function createWarehouse(listData, groupNum = 4, width, height, gap = 3) {
  const warehouseGroup = new THREE.Group()
  const GROUP_NUM = groupNum
  const list = _.chunk(listData, GROUP_NUM)
  const WIDTH = width // 每个仓库的宽
  const HEIGHT = height // 每个仓库的高
  const OFFSET_WIDTH = WIDTH / 2 // 每一个仓库宽的偏移，因为默认是几何中心位置
  const OFFSET_HEIGHT = HEIGHT / 2 // 每一个仓库高的偏移，因为默认是几何中心位置
  const GAP = gap // 建筑物之间的间隔
  // const maxRowOfGroup = list.length 
  // let maxColOfGroup = 0 // 
  const {
    maxCol, // 当作表格来看待，对整体来讲最大的列
    maxRows // 当作表格来看待，对整体来讲最大的行
  } = getGroupChunkArrayDetail(list, GROUP_NUM)

  for (let i = 0, startCount = 0; i < list.length; i++) {
    const row = list[i]
    for (let n = 0; n < row.length; n++) {
      const currentWarehouseData = list[i][n]

      // 创建模型
      // 建筑体
      const buildingBodyGeometry = new THREE.BoxGeometry(WIDTH, 1.5, HEIGHT)
      buildingBodyGeometry.translate(0, 1, 0)
      const buildingBodyMaterial = new THREE.MeshBasicMaterial({
        color: 0xb5b8ff
      })
      const buildingBodyMesh = new THREE.Mesh(buildingBodyGeometry, buildingBodyMaterial)

      // 建筑顶
      const buildingRoofGeometry = new THREE.BoxGeometry(WIDTH, 0.5, HEIGHT)
      buildingRoofGeometry.translate(0, 2, 0)
      const buildingWhiteMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
      const buildingBlueMaterial = new THREE.MeshBasicMaterial({
        color: 0x2c50ff
      })
      const buildingTopMesh = new THREE.Mesh(buildingRoofGeometry, [
        buildingBlueMaterial,
        buildingBlueMaterial,
        buildingWhiteMaterial,
        buildingWhiteMaterial,
        buildingBlueMaterial,
        buildingBlueMaterial
      ])

      modifyShader(buildingBodyMesh)

      const warehouse = new THREE.Group()
      warehouse.add(buildingBodyMesh)
      warehouse.add(buildingTopMesh)
      warehouse.add(makeWarehouseLabel(currentWarehouseData))

      warehouse.position.set(
        n * WIDTH + OFFSET_WIDTH + n * GAP,
        0,
        startCount * HEIGHT + OFFSET_HEIGHT + startCount * GAP
      )
      warehouseGroup.add(warehouse)
      // end 创建模型
    }

    startCount++
  }

  // 修正位置到原点
  warehouseGroup.position.set(
    -(maxCol * WIDTH + (maxCol - 1) * GAP) / 2,
    0,
    -(maxRows * HEIGHT + (maxRows - 1) * GAP) / 2,
  )
  
  warehouseGroup.name = 'warehouseGroup'

  return warehouseGroup
}
