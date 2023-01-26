import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
  constructor(_canvas) {
    super()

    // 初始赋值宽高
    _canvas.width = _canvas.parentElement.clientWidth
    _canvas.height = _canvas.parentElement.clientHeight

    this.width = _canvas.width
    this.height = _canvas.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    window.addEventListener('resize', () => {
      this.width = _canvas.parentElement.clientWidth
      this.height = _canvas.parentElement.clientHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      this.trigger('resize')
    })
  }
}