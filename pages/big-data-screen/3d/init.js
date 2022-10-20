import scene from './scene'
import camera from './camera'
import renderer from './renderer'
import labelRenderer from './cssRenderer'
import controls from './controls'
import resize from './resize'

window.addEventListener('resize', resize)

function render() {
  renderer.render(scene, camera)
  labelRenderer.render(scene,camera)
  controls.update()

  requestAnimationFrame(render)
}

requestAnimationFrame(render)