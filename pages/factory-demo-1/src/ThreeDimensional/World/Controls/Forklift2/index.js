import * as THREE from 'three'
import gsap from 'gsap'

import {
  convertObject3D
} from '../../../Utils/index'
import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

export default class Forklift2 {
  constructor(mesh) {
    this.mesh = mesh
    this.wallAnimation = null

    this.changeLineStyle(this.mesh)
    this.addLightWallEffects()
  }

  changeLineStyle(mesh) {
    const forkliftMesh = convertObject3D(mesh, object3d => {
      const edges = new THREE.EdgesGeometry(object3d.geometry)
      const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

      return lines
    })

    this.mesh = forkliftMesh
  }

  addLightWallEffects() {
    const geometry = new THREE.CylinderGeometry(9, 9, 6, 32)
    geometry.computeBoundingBox()
    const { min, max } = geometry.boundingBox
    const material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color(0xff0000),
        },
        uHeight: {
          value: max.y - min.y
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })
    const wall = new THREE.Mesh(geometry, material)
    wall.position.y = 2.6
    this.mesh.add(wall)

    // 动画光圈偏移
    const scaleOffset = 0.5
    this.wallAnimation = gsap.to(wall.scale, {
      x: 1 + scaleOffset,
      z: 1 + scaleOffset,
      duration: 1,
      repeat: -1,
      yoyo: true,
    })
  }

  destroy() {
    if (this.this.wallAnimation) {
      this.this.wallAnimation.kill()
      this.this.wallAnimation = null
    }
  }
}