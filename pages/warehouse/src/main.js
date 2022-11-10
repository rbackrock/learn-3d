import World from './World/World'

const world = new World({
  containerElement: document.querySelector('#canvas-3d')
})

window.addEventListener('resize', world.resize.bind(world))
