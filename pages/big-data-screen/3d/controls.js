import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'
import renderer from './renderer'

const controls = new OrbitControls(camera, renderer.domElement)
// 不能看到仓库底部
controls.maxPolarAngle = Math.PI / 180 * 75

export default controls
