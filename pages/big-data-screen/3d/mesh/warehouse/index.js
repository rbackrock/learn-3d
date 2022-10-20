import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import modifyShader from './shader'
import makeWarehouseLabel from './makeLabel'

// 创建模型颜色 - 纯色
function makeSolidColorMaterial() {
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x2b4dff) // 0x2b4dff 0x0c0e6f 0x1dc7ff
  })

  return material
}

// 创建线框
function makeBorderLine(geometry) {
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: 0xffffff
  }))

  return line
}

export default function createWarehouse() {
  return new Promise((resolve, reject) => {
    const objLoader = new OBJLoader();
    objLoader.load('/models/warehouse.obj', root => {
      root.traverse(item => {
        if (item.type === 'Mesh') {
          item.material = makeSolidColorMaterial()
          modifyShader(item)

          const line = makeBorderLine(item.geometry)
          // root.add(line)

          root.add(makeWarehouseLabel(1, '1-1-1', '仓库1'))
        }
      })

      root.scale.set(0.2, 0.2, 0.2)
      resolve(root)
    })
  })
}