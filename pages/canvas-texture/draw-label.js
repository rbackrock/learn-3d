function loadLogo(canvasCtx) {
  return new Promise((resolve, reject) => {
    const logoImage = new Image()
    logoImage.src = '/canvas-texture/logo.png'
    logoImage.addEventListener('load', () => {
      canvasCtx.drawImage(
        logoImage,
        15,
        15,
        44.7,
        60
      )
      resolve()
    })
  })
}

function loadQrcode(canvasCtx) {
  return new Promise((resolve, reject) => {
    const logoImage = new Image(250, 250)
    const qrCodeBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAIAAAAHjs1qAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEQ0lEQVR4nO3dwW7bMBQAwbrI//9yeu2JDsCyfPLOXINYlrzg5YHU69fH+f7+PvTJr9frynVvWd/vE/2+/QXg/5E7IXInRO6EyJ0QuRMid0LkTojcCfla/3nmpHBn2ndrMnruujtPY+e6T2zD6k6I3AmROyFyJ0TuhMidELkTIndC5E7Im6nq2rm9jOcmdutPvnVHT3ySazPvyOpOiNwJkTshcidE7oTInRC5EyJ3QuROyNZUlb+d2zP6eSfx3mJ1J0TuhMidELkTIndC5E6I3AmROyFyJyQ3VZ25h/KJ130iqzshcidE7oTInRC5EyJ3QuROiNwJkTshW1PVJ87zbr3B9Jxbb4pdm9mG1Z0QuRMid0LkTojcCZE7IXInRO6EyJ2QN1PVmXPEHbdmkOeuu3N68OfNmNes7oTInRC5EyJ3QuROiNwJkTshcidE7oS8Zu4pfKKd+eWt2Wft17e6EyJ3QuROiNwJkTshcidE7oTInRC5E/Jmu+G5WaAZ5M+vuzZzMjrzN7K6EyJ3QuROiNwJkTshcidE7oTInRC5E/Jmr+rMKePMc2t3nuQ5T5wxr5mqwo/InRC5EyJ3QuROiNwJkTshcidE7oRsjfpmztXWZu43XZs5r12bOa23uhMid0LkTojcCZE7IXInRO6EyJ0QuROy9V7VmXsZd8w8t3bHzJOWd+xMka3uhMidELkTIndC5E6I3AmROyFyJ0TuhBw8AXjmHso173P9V2ae0mx1J0TuhMidELkTIndC5E6I3AmROyFyJ2Rrr+pMt84HnjmBnnlHt76V1Z0QuRMid0LkTojcCZE7IXInRO6EyJ2Qr5mzwB3nvvOtHaUz932uzZy5Wt0JkTshcidE7oTInRC5EyJ3QuROiNwJ2ToBeO2Ju2Bn7hndcWtqPvPXt7oTIndC5E6I3AmROyFyJ0TuhMidELkT8mZsNnPqdmun49qt3Zlrn7efeOd/re6EyJ0QuRMid0LkTojcCZE7IXInRO6EfOB7VddmTmRvuTXN9V5VOE7uhMidELkTIndC5E6I3AmROyFyJ+R5g8C3njgZvfX+2lt7RtfOfbLVnRC5EyJ3QuROiNwJkTshcidE7oTInZCv9Z9n7mSduSt0ZxZ4a365NvPX32F1J0TuhMidELkTIndC5E6I3AmROyFyJ+TNVHXtifO8c/PLmWfe7nznc269g9bqTojcCZE7IXInRO6EyJ0QuRMid0LkTsjWVPWJZp55u3brrN0dtybQa1Z3QuROiNwJkTshcidE7oTInRC5EyJ3QnJT1Zn7a29NGc9NkW9NoNefbHUnRO6EyJ0QuRMid0LkTojcCZE7IXInZGuq+sT3bp6b9u1MGZ/4JNduPck1qzshcidE7oTInRC5EyJ3QuROiNwJkTshd16redQTz+l94j7XtVv3u2Z1J0TuhMidELkTIndC5E6I3AmROyFyJ+QPRABzAHMU7XQAAAAASUVORK5CYII=`
    logoImage.src = qrCodeBase64
    logoImage.addEventListener('load', () => {
      canvasCtx.drawImage(
        logoImage,
        300,
        60,
        160,
        160
      )
      resolve()
    })
  })
}

async function draw() {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = 480
  offscreenCanvas.height = 240
  const canvasCtx = offscreenCanvas.getContext('2d')

  // 画背景
  canvasCtx.save()
  canvasCtx.fillStyle = '#fff'
  canvasCtx.fillRect(0, 0, 480, 240)
  canvasCtx.restore()

  // 画 logo
  await loadLogo(canvasCtx)

  // 画标题
  canvasCtx.save()
  canvasCtx.font = 'bold 30px Microsoft YaHei'
  canvasCtx.fillStyle = '#513a35'
  canvasCtx.fillText('雪茄烟管养中心', 70, 60)
  canvasCtx.restore()

  // 画编号
  canvasCtx.save()
  canvasCtx.font = 'bold 56px Microsoft YaHei'
  canvasCtx.fillStyle = '#513a35'
  canvasCtx.fillText('NO.XLY-33-02', 38, 160)
  canvasCtx.restore()

  // 画二维码
  // await loadQrcode(canvasCtx)

  return offscreenCanvas.toDataURL()
}

export default draw