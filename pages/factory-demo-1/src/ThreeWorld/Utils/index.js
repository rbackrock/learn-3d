import * as THREE from 'three'

export function hasIncludeMeshName(name, includeName, markSymbol = '#') {
  return name.indexOf(`${includeName}${markSymbol}`) !== -1
}

export function convertObject3D(target, createObject3Func) {
  if (target.isGroup) {
    if (target.children.length > 0) {
      for (let i = 0; i < target.children.length; i++) {
        target.children[i] = convertObject3D(target.children[i], createObject3Func)
      }
    }
  } else if (target.isLine || target.isLineLoop || target.isLineSegments || target.isMesh || target.isPoints) {
    const object3d = createObject3Func(target)
    object3d.name = target.name
    object3d.parent = target.parent
    object3d.position.copy(target.position)
    object3d.rotation.copy(target.rotation)
    object3d.scale.copy(target.scale)

    return object3d
  }

  return target
}
/**
 * 
 * @param {*} emptyObject3Ds 
 */
export function makeLineCurve3PathPointsByEmptyObject3D(emptyObject3Ds) {
  const points = []
  const emptyObject3DsLength = emptyObject3Ds.length
  const MAX_EMPTY_OBJECT3D_LENGTH = 2

  if (emptyObject3DsLength >= MAX_EMPTY_OBJECT3D_LENGTH) {
    for (let i = 0, startPointIndex = 0, endPointIndex = 1; i < emptyObject3DsLength - 1; i++, startPointIndex++, endPointIndex++) {
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(
          emptyObject3Ds[startPointIndex].x,
          emptyObject3Ds[startPointIndex].y,
          emptyObject3Ds[startPointIndex].z
        ),
        new THREE.Vector3(
          emptyObject3Ds[endPointIndex].x,
          emptyObject3Ds[endPointIndex].y,
          emptyObject3Ds[endPointIndex].z
        )
      )
      points.push(...curve.getPoints(10))
    }
  }

  return points
}
