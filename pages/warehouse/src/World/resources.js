import {
  LoadingManager,
  TextureLoader
} from 'three';
import {
  OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js'

const assets = {
  objectModel: [
    {
      name: 'warehouse',
      url: '/models/test/4.obj'
    }
  ]
}

export default function() {
  const manager = new LoadingManager()
  const textureLoader = new TextureLoader(manager)
  const objectLoader = new OBJLoader(manager)
  const result = {
    texture: {},
    objectModel: {}
  }

  return new Promise((resolve, reject) => {
    assets.objectModel.forEach(item => {
      objectLoader.load(item.url, root => {
        result.objectModel[item.name] = root
      })
    })

    // 开始加载
    manager.onStart = () => {
      console.log('开始加载资源文件')
    }
    // 加载完成
    manager.onLoad = () => {
      resolve(result)
    }
    // 正在进行中
    manager.onProgress = (url) => {
      console.log(`正在加载：${url}`)
    }

    manager.onError = url => {
      console.log('加载失败：' + url)
      reject()
    }
  })
}
