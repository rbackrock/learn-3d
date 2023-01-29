import * as THREE from 'three'
import gsap from 'gsap'

import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

export default class FlyLine {
  constructor(flyLineVector3List) {
    this.flyLineVector3List = flyLineVector3List
    this.flyLineAnimation = null

    this.create()
  }

  create() {
    const lineCurve = new THREE.CatmullRomCurve3(this.flyLineVector3List)
    const points = lineCurve.getPoints(9000)
    const flyLineGeometry = new THREE.BufferGeometry().setFromPoints(points)

    const aSizeArray = new Float32Array(points.length)
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i
    }
    flyLineGeometry.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1))

    const flyLineMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color(0xff0000),
        },
        uLength: {
          value: points.length,
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    const flyLine = new THREE.Points(flyLineGeometry, flyLineMaterial)
    flyLine.name = 'flyLine'

    this.flyLineAnimation = gsap.to(flyLineMaterial.uniforms.uTime, {
      value: 9000,
      duration: 2,
      repeat: -1,
      ease: "none",
    })

    return flyLine
  }

  destroy() {
    if (this.this.flyLineAnimation) {
      this.this.flyLineAnimation.kill()
      this.this.flyLineAnimation = null
    }
  }
}