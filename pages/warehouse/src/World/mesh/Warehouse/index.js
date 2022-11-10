import * as THREE from 'three'

export default class Warehouse {
  constructor({ model, lineColor, modelColor, modelOpacity }) {
    this.model = model
    this.modelName = 'warehouse'
    this.lineColor = lineColor
    this.modelColor = modelColor
    this.modelOpacity = modelOpacity
  }

  create() {
    const group = new THREE.Group()
    this.model.traverse(child => {
      if (child.isMesh) {
        const scaleValue = 0.001

        const edges = new THREE.EdgesGeometry(child.geometry)
        const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: this.lineColor }))
        lines.scale.set(scaleValue, scaleValue, scaleValue)

        const basicMaterial = new THREE.MeshBasicMaterial({
          color: this.modelColor,
          opacity: this.modelOpacity,
          transparent: true
        })
        const model = new THREE.Mesh(child.geometry, basicMaterial)
        model.name = this.modelName
        model.scale.set(scaleValue, scaleValue, scaleValue)

        group.add(lines)
        group.add(model)
      }
    })

    this.group = group

    return this.group
  }

  getLandSize() {
    const geometry = this.group.getObjectByName(this.modelName).geometry
    geometry.computeBoundingBox()
    const box = geometry.boundingBox
    console.log(geometry.boundingBox)
    return {
      width: Math.abs(box.max.z) + Math.abs(box.min.z),
      height: Math.abs(box.max.x) + Math.abs(box.min.x)
    }
  }
}