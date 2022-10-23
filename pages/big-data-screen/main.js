import './3d/init'

import scene from './3d/scene'
import axesHelper from './3d/axesHelper'
import {
  createWarehouse
} from './3d/mesh/warehouse'
import createFloor from './3d/mesh/floor'

const listData = [
  {
    id: 1,
    roomNum: '1-1',
    roomName: '房间1'
  },
  {
    id: 2,
    roomNum: '1-2',
    roomName: '房间2'
  },
  {
    id: 3,
    roomNum: '1-3',
    roomName: '房间3'
  },
  {
    id: 4,
    roomNum: '1-4',
    roomName: '房间4'
  },
  {
    id: 5,
    roomNum: '1-5',
    roomName: '房间5'
  },
  {
    id: 6,
    roomNum: '1-6',
    roomName: '房间6'
  },
  {
    id: 7,
    roomNum: '1-7',
    roomName: '房间7'
  }
]

function addWareHouseAndFloor(scene, wareHouseDataList) {
  const wareHouseWidth = 5
  const wareHouseHeight = 8
  const listGroupNum = 4
  const wareHouse = createWarehouse(wareHouseDataList, listGroupNum, wareHouseWidth, wareHouseHeight)
  const floor = createFloor(wareHouseDataList, listGroupNum, wareHouseWidth, wareHouseHeight)

  scene.add(wareHouse)
  scene.add(floor)
}

// scene add
scene.add(axesHelper)
const warehouseGroupObject = scene.getObjectByName('warehouseGroup')
if (warehouseGroupObject) {
  scene.getObjectByName('warehouseGroup').removeFromParent()
}
addWareHouseAndFloor(scene, listData)
