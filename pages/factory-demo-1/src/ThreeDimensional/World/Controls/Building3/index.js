import * as THREE from 'three'
import gsap from 'gsap'

import ThreeDimensional from '../../../ThreeDimensional'

export default class Building3 {
  constructor(mesh) {
    this.mesh = mesh

    this.threeDimensional = new ThreeDimensional()
    this.resources = this.threeDimensional.resources

    this.fireAnimation = null

    this.addFireSprite()
  }

  addFireSprite() {
    const material = new THREE.SpriteMaterial({
      map: this.resources.fireImage
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(9, 9, 9)
    sprite.position.y = 26

    this.fireAnimation = gsap.to(sprite.scale, {
      x: 12,
      y: 12,
      z: 12,
      duration: 0.6,
      repeat: -1,
      yoyo: true
    })

    this.mesh.add(sprite)
  }

  destroy() {
    if (this.this.fireAnimation) {
      this.this.fireAnimation.kill()
      this.this.fireAnimation = null
    }
  }
}