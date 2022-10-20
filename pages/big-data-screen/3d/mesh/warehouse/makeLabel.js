import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'

export default function(id, serialNumber, name) {
  const warehouseInfoElement = document.createElement('div')
  warehouseInfoElement.innerHTML = `
    <div class="serialNumber">${serialNumber}</div>
    <div class="name">${name}</div>
  `

  const warehouseLabel = new CSS2DObject(warehouseInfoElement)
  warehouseLabel.position.set(0, 10, 0)

  warehouseInfoElement.addEventListener('click', evt => {
    console.log('abc')
  })

  return warehouseLabel
}