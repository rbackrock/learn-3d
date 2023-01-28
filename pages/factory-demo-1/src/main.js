import load from './ThreeDimensional/resources/index'
import {
  cameraType,
  viewType
} from './ThreeDimensional/Camera'
import ThreeDimensional from './ThreeDimensional/ThreeDimensional'

const load1 = () => {
  return new Promise((resolve, reject) => {
    resolve('模拟非 3D 相关异步数据')
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

      if (radioValue === cameraType.STANDARD) {
        document.querySelector('#default-view-button-hook').disabled = false
        document.querySelector('#machine-view-button-hook').disabled = false
      } else {
        document.querySelector('#default-view-button-hook').disabled = true
        document.querySelector('#machine-view-button-hook').disabled = true
      }
    })
  }

  // 切换中央机器显示风格
  const machineRadio = document.querySelectorAll('.machine')
  for (const machine of machineRadio) {
    machine.addEventListener('change', evt => {
      const radioValue = evt.target.value

      if (radioValue === 'origin') {
        wolrd.controls.machine.setOriginMesh()
      } else if (radioValue === 'line') {
        wolrd.controls.machine.setLineMesh()
      }
    })
  }

  // 切换视角
  document.querySelector('#default-view-button-hook').addEventListener('click', evt => {
    threeDimensional.camera.changeViewPosition(viewType.STANDARD)
  })

  document.querySelector('#machine-view-button-hook').addEventListener('click', evt => {
    threeDimensional.camera.changeViewPosition(viewType.MACHINE)
  })

  // 测试释放资源是否有问题
  // window.setTimeout(() => {
  //   threeDimensional.destroy()
  // }, 3 * 1000)
}

main()