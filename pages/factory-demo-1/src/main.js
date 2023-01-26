import load from './ThreeDimensional/resources/index'
import ThreeDimensional from './ThreeDimensional/ThreeDimensional'

const load1 = () => {
  return new Promise((resolve, reject) => {
    resolve('hello')
  })
}

async function main() {
  await load1()
  const resources = await load()

  document.querySelector('#loading-3d').style.display = 'none'
  const threeDimensional = new ThreeDimensional(document.querySelector('canvas.webgl'), resources)

  // UI 操作
  const truckRadio = document.querySelectorAll('.truck-status')
  for (const truck of truckRadio) {
    truck.addEventListener('change', evt => {
      const radioValue = evt.target.value
      if (radioValue === 'pause') {
        threeDimensional.wolrd.controls.truck.stop()
      } else if (radioValue === 'restart') {
        threeDimensional.wolrd.controls.truck.restart()
      }
    })
  }
}

main()