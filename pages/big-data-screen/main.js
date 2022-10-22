import './3d/init'

import scene from './3d/scene'
import axesHelper from './3d/axesHelper'
import {
  createWarehouse
} from './3d/mesh/warehouse'
import createFloor from './3d/mesh/floor'

const wareHouseWidth = 5
const wareHouseHeight = 8
const listGroupNum = 4
const listData = [
  {
    id: 1
  },
  {
    id: 1
  },
  {
    id: 1
  },
  {
    id: 1
  },
  {
    id: 1
  },
  {
    id: 1
  },
  {
    id: 1
  }
]

const wareHouse = createWarehouse(listData, listGroupNum, wareHouseWidth, wareHouseHeight)
const floor = createFloor(listData, listGroupNum, wareHouseWidth, wareHouseHeight)

scene.add(axesHelper)
scene.add(wareHouse)
scene.add(floor)

