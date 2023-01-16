import gsap from 'gsap'
import {
  hasIncludeMeshName
} from '../../Utils/index'

export default class Truck {
  constructor(mesh) {
    this.mesh = mesh
    this.run()
  }

  run() {
    this.mesh.traverse(child => {
      // 让轮子转
      if (hasIncludeMeshName(child.name, 'truck-wheel')) {
        const s = gsap.to(child.rotation, {
          x: Math.PI * 2,
          duration: 2.3,
          ease: 'none',
          repeat: -1,
        })
      }
    })
  }
}