export function getCanvasWidthAndHeightAndSelf() {
  const canvas = document.querySelector('#canvas-3d-hook')
  return {
    canvas,
    width: canvas.width,
    height: canvas.height
  }
}

export function getGroupChunkArrayDetail(list, groupNum) {
  const result = {
    maxCol: 0,
    maxRows: list.length
  }

  for (let i = 0; i < list.length; i++) {
    const row = list[i]
    if (row.length === groupNum) {
      result.maxCol = row.length
      break
    } else if (row.length > result.maxCol) {
      result.maxCol = row.length
    }
  }

  return result
}
