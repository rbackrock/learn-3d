import load from './ThreeWorld/resources/index'
import ThreeWorld from './ThreeWorld/ThreeWorld'

const load1 = () => {
  return new Promise((resolve, reject) => {
    resolve('hello')
  })
}

async function main() {
  await load1()
  const resources = await load()

  document.querySelector('#loading-3d').style.display = 'none'
  const threeWorld = new ThreeWorld(document.querySelector('canvas.webgl'), resources)

  // UI 操作
  const truckRadio = document.querySelectorAll('.truck-status')
  for (const truck of truckRadio) {
    truck.addEventListener('change', evt => {
      const radioValue = evt.target.value
      if (radioValue === 'pause') {
        threeWorld.wolrd.controls.truck.stop()
      } else if (radioValue === 'restart') {
        threeWorld.wolrd.controls.truck.restart()
      }
    })
  }
}

main()