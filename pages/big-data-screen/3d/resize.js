import camera from './camera'
import renderer from './renderer'

const canvas = document.querySelector('#canvas-3d')
const width = canvas.offsetWidth
const height = canvas.offsetHeight

export default function resize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
}
