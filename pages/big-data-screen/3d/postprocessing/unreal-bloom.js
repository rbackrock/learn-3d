import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import renderer from '../renderer'
import {
  getCanvasWidthAndHeightAndSelf
} from '../helper'

import scene from '../scene'
import camera from '../camera'

const {
  width,
  height
} = getCanvasWidthAndHeightAndSelf()

const params = {
  exposure: 2,
  bloomStrength: 0.6,
  bloomThreshold: 0,
  bloomRadius: 1
}

const renderScene = new RenderPass(scene, camera)

const bloomPass = new UnrealBloomPass(new THREE.Vector2( width, height ), 1.5, 0.4, 0.85)
bloomPass.threshold = params.bloomThreshold
bloomPass.strength = params.bloomStrength
bloomPass.radius = params.bloomRadius

const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)

export default composer