export function getCanvasWidthAndHeightAndSelf() {
  const canvas = document.querySelector('#canvas-3d-hook')
  return {
    canvas,
    width: canvas.width,
    height: canvas.height
  }
}
