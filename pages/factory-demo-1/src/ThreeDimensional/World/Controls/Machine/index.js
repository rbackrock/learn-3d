import * as THREE from 'three'
import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import gsap from 'gsap'

import {
  convertObject3D,
  deepCloneObject3d
} from '../../../Utils/index'
import ThreeDimensional from '../../../ThreeDimensional'
import vertexRadar from './shader/vertexRadar.glsl'
import fragmentRadar from './shader/fragmentRadar.glsl'

export default class Machine {
  constructor(mesh) {
    this.mesh = mesh
    this.threeDimensional = new ThreeDimensional()
    this.scene = this.threeDimensional.scene
    this.originMesh = deepCloneObject3d(mesh)
    this.radarAnimation = null

    this.setLabel()
    this.addRadarScanEffects()
  }

  setLabel() {
    const labelElement = document.querySelector('#machine-label-hook')
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

  // 添加雷达扫描特效
  addRadarScanEffects() {
    const geometry = new THREE.PlaneGeometry(70, 70)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color(0xff0000),
        }
      },
      vertexShader: vertexRadar,
      fragmentShader: fragmentRadar
    })

    const radar = new THREE.Mesh(geometry, material)
    radar.rotation.x = -Math.PI / 2
    radar.position.y = 0.1
    this.mesh.add(radar)

    this.radarAnimation = gsap.to(material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      ease: "none",
    })
  }

  destroy() {
    if (this.radarAnimation) {
      this.radarAnimation.kill()
      this.radarAnimation = null
    }
  }
}