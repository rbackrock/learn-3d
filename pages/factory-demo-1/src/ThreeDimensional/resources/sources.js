import sourceType from './sourceType'

export default [
  // {
  //   name: 'environmentMapTexture',
  //   type: sourceType.CUBE_TEXTURE,
  //   path:[
  //     '/common/resources/environmentMapTexture/box1/posx.jpg',
  //     '/common/resources/environmentMapTexture/box1/negx.jpg',
  //     '/common/resources/environmentMapTexture/box1/posy.jpg',
  //     '/common/resources/environmentMapTexture/box1/negy.jpg',
  //     '/common/resources/environmentMapTexture/box1/posz.jpg',
  //     '/common/resources/environmentMapTexture/box1/negz.jpg',
  //   ]
  // },
  {
    name: 'gltfModel',
    type: sourceType.GLTFMODEL,
    path: [
      // '/factory-demo-1/models/factory-area.glb'
      'http://cdn.rback.fun/factory-demo-1/factory-area.glb'
    ]
  },
  {
    name: 'fireImage',
    type: sourceType.TEXTURE,
    path: [
      // '/factory-demo-1/images/fire.png'
      'http://cdn.rback.fun/factory-demo-1/fire.png'
    ]
  }
]