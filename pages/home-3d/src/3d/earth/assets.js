/**
 * 资源文件
 * 把模型和图片分开进行加载
 */

const filePath = '/3d-earth/images/'
const fileSuffix = [
  'gradient',
  'redCircle',
  "label",
  "aperture",
  'glow',
  'light_column',
  'aircraft'
]

const textures = fileSuffix.map(item => {
  return {
    name: item,
    url: filePath + item + '.png'
  }
})

textures.push({
  name: 'earth',
  url: filePath + 'earth.jpg'
})

const resources = {
  textures
}


export {
  resources
}