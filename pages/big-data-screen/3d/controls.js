import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'

const canvas = document.querySelector('#canvas-3d')
const controls = new OrbitControls(camera, canvas)

controls.maxPolarAngle = Math.PI / 180 * 90

export default controls
