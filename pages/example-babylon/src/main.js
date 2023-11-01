import {
  Engine,
  Scene,
  ArcRotateCamera,
  MeshBuilder,
  Vector3,
  AxesViewer
} from '@babylonjs/core'

const canvas = document.querySelector('.webgl')
const engine = new Engine(canvas, true)
const scene = new Scene(engine)

const camera = new ArcRotateCamera(
  'mainCamera', 
  3,
  3,
  3,
  new Vector3(0, 0, 0),
  scene
)
camera.setTarget(Vector3.Zero())
camera.attachControl(canvas, true)      

const box = MeshBuilder.CreateBox('box', {
  width: 3,
  height: 3
}, scene)

const localAxes = new AxesViewer(scene, 1)

engine.runRenderLoop(() => {
  scene.render()
  console.log(camera.position)
})

console.log(box)
// console.log(camera.cameraDirection)