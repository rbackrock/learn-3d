import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import sources from './sources'

import sourceType from './sourceType'

export default function load(startFuncHandler = () => {}, progressFuncHandler = () => {}) {
  return new Promise((resolve, reject) => {
    const isEmptySources = sources.length === 0

    if (isEmptySources) {
      resolve()
    } else {
      const manager = new THREE.LoadingManager()
      const items = {}
      const loaders = {}

      // 准备模型压缩加载器
      const dracoLoader = new DRACOLoader(manager)
      dracoLoader.setDecoderPath('/draco/')

      // 准备使用到的 loader
      loaders.gltfLoader = new GLTFLoader(manager)
      loaders.gltfLoader.setDRACOLoader(dracoLoader)
      loaders.textureLoader = new THREE.TextureLoader(manager)
      loaders.cubeTextureLoader = new THREE.CubeTextureLoader(manager)

      // 这里代码有先后执行顺序约束，先准备好回调
      manager.onStart = startFuncHandler
      manager.onProgress = progressFuncHandler
      manager.onLoad = () => {
        resolve(items)
      }
      manager.onError = url => {
        reject(url)
      }

      for(const source of sources) {
        if(source.type === sourceType.GLTFMODEL) {
          loaders.gltfLoader.load(source.path, file => {
            items[source.name] = file
          })
        } else if (source.type === sourceType.TEXTURE) {
          loaders.textureLoader.load(source.path, file => {
            items[source.name] = file
          })
        } else if (source.type === sourceType.CUBE_TEXTURE) {
          loaders.cubeTextureLoader.load(source.path, file => {
            items[source.name] = file
          })
        }
      }
    }
  })
}
