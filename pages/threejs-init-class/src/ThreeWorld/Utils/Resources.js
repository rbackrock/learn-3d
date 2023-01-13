import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import EventEmitter from './EventEmitter'

const type = {
  CUBE_TEXTURE: 'cubeTexture',
  TEXTURE: 'texture',
  GLTFMODEL: 'gltfModel'
}

export const sourceType = type

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    this.sources = sources
    this.isEmptySources = sources.length === 0
    this.items = {}
    
    this.setLoaders()
    this.startLoading()

    if (this.isEmptySources) {
      this.closeLoadingTips()
    }
  }

  setLoaders() {
    const manager = new THREE.LoadingManager();

    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader(manager)
    this.loaders.textureLoader = new THREE.TextureLoader(manager)
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(manager)

    manager.onStart = (url, itemsLoaded, itemsTotal) => {
      this.trigger('start', [url, itemsLoaded, itemsTotal])
    }

    manager.onLoad = () => {
      this.closeLoadingTips()
      this.trigger('load', this.items)
    }

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      this.trigger('progress', [url, itemsLoaded, itemsTotal])
    }

    manager.onError = url => {
      this.trigger('error', [url])
    }
  }

  startLoading() {
    for(const source of this.sources) {
      if(source.type === type.GLTFMODEL) {
        this.loaders.gltfLoader.load(source.path, file => {
          this.items[source.name] = file
        })
      } else if (source.type === type.TEXTURE) {
        this.loaders.textureLoader.load(source.path, file => {
          this.items[source.name] = file
        })
      } else if (source.type === type.CUBE_TEXTURE) {
        this.loaders.cubeTextureLoader.load(source.path, file => {
          this.items[source.name] = file
        })
      }
    }
  }

  closeLoadingTips() {
    document.querySelector('#loading-3d').style.display = 'none'
  }
}
