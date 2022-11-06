/**
 * 资源管理和加载
 */
import { LoadingManager, Texture, TextureLoader } from 'three';
import { resources } from './assets'

export const loadResource = () => {
  const manager = new LoadingManager();
  const textures = {};
  const textureLoader = new TextureLoader(manager)
  return new Promise((resolve, reject) => {
    resources.textures?.forEach((item) => {
      textureLoader.load(item.url, (t) => {
        textures[item.name] = t
      })
    })

    // 开始加载
    manager.onStart = () => {
      console.log('开始加载资源文件')
    }
    // 加载完成
    manager.onLoad = () => {
      resolve(textures)
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