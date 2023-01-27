import load from './ThreeDimensional/resources/index'
import ThreeDimensional from './ThreeDimensional/ThreeDimensional'
import World from './ThreeDimensional/World/World'

const load1 = () => {
  return new Promise((resolve, reject) => {
    resolve('模拟异步数据')
  })
}

async function main() {
  await load1()
  const resources = await load()

  document.querySelector('#loading-3d').style.display = 'none'
  const threeDimensional = new ThreeDimensional(document.querySelector('canvas.webgl'), resources)
  const wolrd = threeDimensional.wolrd

  // 设置卡车标记内容
  wolrd.controls.truck.setLabel({
    num: '#333',
    name: '我是一辆卡车'
  })

  // 切换卡车暂停和重启
  const truckRadio = document.querySelectorAll('.truck-status')
  for (const truck of truckRadio) {
    truck.addEventListener('change', evt => {
      const radioValue = evt.target.value
      if (radioValue === 'pause') {
        wolrd.controls.truck.stop()
      } else if (radioValue === 'restart') {
        wolrd.controls.truck.restart()
      }
    })
  }

  // 切换摄像机视角
  const cameraRadio = document.querySelectorAll('.camera')
  for (const camera of cameraRadio) {
    camera.addEventListener('change', evt => {
      const radioValue = evt.target.value
      // console.log(radioValue)
      threeDimensional.camera.setActiveCamera(radioValue)
    })
  }

  // 测试释放资源是否有问题
  // window.setTimeout(() => {
  //   threeDimensional.destroy()
  // }, 3 * 1000)
}

main()