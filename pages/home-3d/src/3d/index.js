import * as THREE from 'three'

import scene from './scene'
import camera from './camera'
import renderer from './renderer'
import controls from './controls'
import resize from './resize'
import axesHelper from './axesHelper'

import {
  createEarth
} from './earth/index'

export async function run() {
  // scene.add(axesHelper)

  // 添加地球
  let earth = await createEarth()
  earth.group.position.set(0, 30, 0)
  scene.add(earth.group)
  

  window.addEventListener('resize', resize)
  function render() {
    renderer.render(scene, camera)
    controls.update()

    earth.render()

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}