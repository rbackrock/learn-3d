import * as THREE from 'three'
import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {
  convertObject3D,
  deepCloneObject3d
} from '../../Utils/index'
import ThreeDimensional from '../../ThreeDimensional'

export default class Machine {
  constructor(mesh) {
    this.mesh = mesh
    this.threeDimensional = new ThreeDimensional()
    this.scene = this.threeDimensional.scene
    this.originMesh = deepCloneObject3d(mesh)

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

  setLineMesh() {
    const newOriginMesh = deepCloneObject3d(this.originMesh)
    const lineMesh = convertObject3D(newOriginMesh, object3d => {
      const edges = new THREE.EdgesGeometry(object3d.geometry)
      const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

      return lines
    })

    console.log(lineMesh);

    const machineObject3d = this.scene.getObjectByName('machine')
    if (machineObject3d) {
      this.mesh = lineMesh
      this.scene.remove(machineObject3d)
      this.scene.add(lineMesh)
    }
  }

  setOriginMesh() {
    const machineObject3d = this.scene.getObjectByName('machine')
    if (machineObject3d) {
      this.scene.remove(machineObject3d)

      const newOriginMesh = deepCloneObject3d(this.originMesh)
      this.mesh = newOriginMesh
      this.scene.add(newOriginMesh)
    }
  }
}