import * as THREE from 'three'
import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import gsap from 'gsap'
import {
  hasIncludeMeshName
} from '../../Utils/index'
import ThreeDimensional from '../../ThreeDimensional'

export default class Truck {
  constructor(mesh) {
    this.mesh = mesh
    this.threeDimensional = new ThreeDimensional()
    this.camera = this.threeDimensional.camera
    this.scene = this.threeDimensional.scene

    this.wheelAnimation = []
    this.runAnimation = null
    this.raycaster = new THREE.Raycaster()
  }

  run(truckPath) {
    this.mesh.traverse(child => {
      // 让轮子转
      if (hasIncludeMeshName(child.name, 'truck-wheel')) {
        this.wheelAnimation.push(
          gsap.to(child.rotation, {
            x: Math.PI * 2,
            duration: 2.3,
            ease: 'none',
            repeat: -1,
          })
        )
      }
    })

    const animate = {
      process: 0
    }
    this.runAnimation = gsap.to(animate, {
      process: 1,
      duration: 16,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const point = truckPath.getPoint(animate.process)
        this.mesh.position.set(point.x, point.y, point.z)

        const lootAtPoint = truckPath.getPoint(animate.process + 0.0001)
        this.mesh.lookAt(lootAtPoint.x, 0, lootAtPoint.z)
      }
    })
  }

  stop() {
    if (this.wheelAnimation.length > 0) {
      for (const wheel of this.wheelAnimation) {
        wheel.pause()
      }
    }

    if (this.runAnimation) {
      this.runAnimation.pause()
    }
  }

  restart() {
    if (this.wheelAnimation.length > 0) {
      for (const wheel of this.wheelAnimation) {
        wheel.play()
      }
    }

    if (this.runAnimation) {
      this.runAnimation.play()
    }
  }

  setLabel(data) {
    const labelElement = document.createElement('div')
    labelElement.innerHTML = `
      <div id="truck-label-hook" class="three-label-container">
        <div class="three-label-container-wrapper">
          <div class="title-container">
            <div class="title-container-wrapper">
              <div class="room-id">${data.num}</div>
              <div class="room-name">${data.name}</div>
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

    this.label = new CSS2DObject(labelElement)
    this.label.position.set(0, 9, 0)

    this.mesh.add(this.label)
  }

  update() {
    // 标签和相机距离
    const labelPosition = this.mesh.position.clone()
    labelPosition.y += 6
    const labelDistance = labelPosition.distanceTo(this.camera.instance.position)

    // 通过摄像机和目标位置更新射线，射线需要 NDC 归一化为设备坐标
    const labelPositionForNDC = this.mesh.position.clone()
    labelPositionForNDC.y += 6
    labelPositionForNDC.project(this.camera.instance)
    this.raycaster.setFromCamera(labelPositionForNDC, this.camera.instance)

    const intersects = this.raycaster.intersectObjects(this.scene.children, false)
    if (intersects.length == 0) {
      document.querySelector('#truck-label-hook').style.display = 'block'
    } else {
      if (intersects[0].distance < labelDistance) {
        document.querySelector('#truck-label-hook').style.display = 'none'
      } else {
        document.querySelector('#truck-label-hook').style.display = 'block'
      }
    }
  }

  destroy() {
    if (this.wheelAnimation.length > 0) {
      for (const wheel of this.wheelAnimation) {
        wheel.kill()
      }
      this.wheelAnimation = null
    }

    if (this.runAnimation) {
      this.runAnimation.kill()
      this.runAnimation = null
    }
  }
}
