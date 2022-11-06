import * as THREE from 'three'

const scene = new THREE.Scene()
const texture = new THREE.TextureLoader().load('/home-3d/bg.jpg')
scene.background = texture

export default scene
