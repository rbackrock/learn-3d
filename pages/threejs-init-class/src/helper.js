export function getCanvasWidthAndHeightAndSelf(canvas3dElement) {
  const canvas = canvas3dElement
  return {
    canvas,
    width: canvas.width,
    height: canvas.height
  }
}
