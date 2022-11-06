import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'
import renderer from './renderer'

const controls = new OrbitControls(camera, renderer.domElement)
// 使动画循环使用时阻尼或自转 意思是否有惯性
controls.enableDamping = true;
// 是否开启右键拖拽
controls.enablePan = false;
// 是否可以缩放
controls.enableZoom = false;
// 动态阻尼系数 就是鼠标拖拽旋转灵敏度
controls.dampingFactor = 0.05;

controls.enabled = false

export default controls
