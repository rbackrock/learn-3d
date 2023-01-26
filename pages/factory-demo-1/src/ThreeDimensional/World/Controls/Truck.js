import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import gsap from 'gsap'
import {
  hasIncludeMeshName
} from '../../Utils/index'

export default class Truck {
  constructor(mesh) {
    this.mesh = mesh

    this.wheelAnimation = []
    this.runAnimation = null
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
      <div class="three-label-container">
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

    const label = new CSS2DObject(labelElement)
    label.position.set(0, 9, 0)

    this.mesh.add(label)
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
