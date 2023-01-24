import * as THREE from 'three'
import gsap from 'gsap'
import {
  hasIncludeMeshName
} from '../../Utils/index'

export default class Truck {
  constructor(mesh) {
    this.mesh = mesh
  }

  run(truckPath) {
    this.mesh.traverse(child => {
      // 让轮子转
      if (hasIncludeMeshName(child.name, 'truck-wheel')) {
        gsap.to(child.rotation, {
          x: Math.PI * 2,
          duration: 2.3,
          ease: 'none',
          repeat: -1,
        })
      }
    })

    const animate = {
      process: 0
    }
    gsap.to(animate, {
      process: 1,
      duration: 9,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        // const point = truckPath.getPoint(animate.process)
        // this.mesh.position.set(point.x, point.y, point.z)

        // const lootAtPoint = truckPath.getPoint(animate.process + 0.0001)
        // this.mesh.lookAt(lootAtPoint.x, 0, lootAtPoint.z)

        // const targetPosition = new THREE.Vector3();
        // truckPath.getWorldPosition(targetPosition);
        // turretPivot.lookAt(targetPosition);
        // this.mesh.lookAt(targetPosition)
      }
    })

    // const a = {
    //   index: 0
    // }
    // gsap.to(a, {
    //   index: truckPath.length,
    //   duration: 9,
    //   repeat: -1,
    //   ease: 'none',
    //   onUpdate: () => {
    //     console.log(a.index)
    //     // this.mesh.position.set(truckPath[a.index].x, truckPath[a.index].y, truckPath[a.index].z)
    //   }
    // })
  }
}