import ThreeWorld from '../ThreeWorld'
import Environment from './Environment'
import Box from './Box'

export default class World {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.scene = this.threeWorld.scene
    this.resources = this.threeWorld.resources

    if (this.resources.isEmptySources) {
      this.create()
    } else {
      this.resources.on('load', () => {
        this.create()
      })
    }
  }

  create() {
    this.environment = new Environment()
    this.box = new Box()
  }
}
