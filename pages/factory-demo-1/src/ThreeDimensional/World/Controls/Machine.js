import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'

export default class Machine {
  constructor(mesh) {
    this.mesh = mesh

    this.setLabel()
  }

  setLabel() {
    const labelElement = document.createElement('div')
    labelElement.innerHTML = `
      <div id="machine-label-hook" class="three-label-container">
        <div class="three-label-container-wrapper">
          <div class="title-container">
            <div class="title-container-wrapper">
              <div class="room-name">${`我是中央机器`}</div>
            </div>
          </div>
          <div class="icon-container">
            <div class="icon-container-wrapper">
              <div class="fan-container">
                <div class="fan-part1"></div>
                <div class="fan-part2"></div>
              </div>
              <div class="cctv-container">
                <!--<div class="cctv-wrapper"></div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    this.label = new CSS2DObject(labelElement)
    this.label.position.set(0, 28, 0)

    this.mesh.add(this.label)
  }

  setLabelVisible(visible) {
    const labelElement = document.querySelector('#machine-label-hook')
    const labelClassList = labelElement.classList
    let hasVisible = false
    for(const clazzName of labelClassList) {
      if (clazzName === 'visible') {
        hasVisible = true
        break
      }
    }

    if (visible && !hasVisible) {
      labelClassList.add('visible')
    }

    if (!visible && hasVisible) {
      labelClassList.remove('visible')
    }
  }
}