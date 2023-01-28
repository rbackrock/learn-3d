import * as THREE from 'three'

/**
 * 在 Blender 中为需要操作的元素命名，格式为{名称 + 标记符号},例如，tree#1, tree#2, tree#3 方便获取
 * @param {String} name 当前模型元素名称
 * @param {String} includeName 包含的元素名称
 * @param {String} markSymbol 标记字符
 */
export function hasIncludeImportMeshName(name, includeName, markSymbol = '#') {
  return name.indexOf(`${includeName}${markSymbol}`) !== -1
}

export function importMeshNameNumber(name = '', markSymbol = '#') {
  const splitArray = name.split(markSymbol)
  if (splitArray.length > 1) {
    return splitArray[1]
  }

  return ''
}

/**
 * 提柜让 Object3d 对象转化为希望的 Object3d方法
 * @param {Object} target 目标 object3d
 * @param {Function} createObject3Func 创新新 Object3d 方法
 */
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

/**
 * 归一化鼠标在可视化区域中的坐标
 * @param {Number} containerWidth 画布容器宽度
 * @param {Number} containerHeight 画布容器高度
 * @param {Number} x 鼠标在画布中的 x 坐标
 * @param {Number} y 鼠标在画布中的 Y 坐标
 */
export function covertMousePositionToNDC(containerWidth, containerHeight, x, y) {
  const ndcPosition = new THREE.Vector2()
  ndcPosition.x = (x / containerWidth) * 2 - 1
  ndcPosition.y = -(y / containerHeight) * 2 + 1

  return ndcPosition
}

/**
 * 深度克隆 Object3d 对象
 * @param {Object} targetObject3d 克隆目标对象
 */
export function deepCloneObject3d(targetObject3d) {
  if (targetObject3d instanceof THREE.Object3D) {
    const newObject3d = targetObject3d.clone()
    newObject3d.name = targetObject3d.name
    newObject3d.parent = targetObject3d.parent
    newObject3d.position.copy(targetObject3d.position)
    newObject3d.rotation.copy(targetObject3d.rotation)
    newObject3d.scale.copy(targetObject3d.scale)

    return newObject3d
  }

  return null
}
