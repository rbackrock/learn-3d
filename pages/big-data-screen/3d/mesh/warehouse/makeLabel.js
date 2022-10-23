import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'

export default function(warehouseData) {
  const warehouseInfoElement = document.createElement('div')
  warehouseInfoElement.innerHTML = `
    <div class="three-label-container">
      <div class="three-label-container-wrapper">
        <div class="title-container">
          <div class="title-container-wrapper">
            <div class="room-id">${warehouseData.roomNum}</div>
            <div class="room-name">${warehouseData.roomName}</div>
          </div>
        </div>
        <div class="icon-container">
          <div class="icon-container-wrapper">
            <div class="fan-container">
              <div class="fan-part1"></div>
              <div class="fan-part2"></div>
            </div>
            <div class="cctv-container">
              <div class="cctv-wrapper"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const warehouseLabel = new CSS2DObject(warehouseInfoElement)
  warehouseLabel.position.set(0, 4, 0)

  warehouseInfoElement.querySelector('.title-container-wrapper').addEventListener('click', evt => {
    console.log('标题被点了')
  })

  warehouseInfoElement.querySelector('.cctv-wrapper').addEventListener('click', evt => {
    console.log('摄像头被点了')
  })

  return warehouseLabel
}