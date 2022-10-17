import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'

const canvas = document.querySelector('#canvas-3d')
const controls = new OrbitControls(camera, canvas)

export default controls
