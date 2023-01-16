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
