import './3d/init'

import scene from './3d/scene'
import axesHelper from './3d/axesHelper'
import createWarehouse from './3d/mesh/warehouse'
import createFloor from './3d/mesh/floor'

const floor = createFloor()
const wareHouse = await createWarehouse()

scene.add(axesHelper)
scene.add(wareHouse)
scene.add(floor)