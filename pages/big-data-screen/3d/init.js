import scene from './scene'
import camera from './camera'
import renderer from './renderer'
import controls from './controls'

function render() {
  renderer.render(scene, camera)
  controls.update()

  requestAnimationFrame(render)
}

requestAnimationFrame(render)