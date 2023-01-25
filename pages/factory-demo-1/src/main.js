import load from './ThreeWorld/resources/index'
import ThreeWorld from './ThreeWorld/ThreeWorld'

const load1 = () => {
  return new Promise((resolve, reject) => {
    resolve('hello')
  })
}

const load2 = load()

Promise.all([
  load1(),
  load2
]).then(data => {
  document.querySelector('#loading-3d').style.display = 'none'
  const threeWorld = new ThreeWorld(document.querySelector('canvas.webgl'), data[1])
})
