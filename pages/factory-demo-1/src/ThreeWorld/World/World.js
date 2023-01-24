import * as THREE from 'three'
import ThreeWorld from '../ThreeWorld'
import Environment from './Environment'
import {
  hasIncludeMeshName,
  convertObject3D,
  makeLineCurve3PathPointsByEmptyObject3D
} from '../Utils/index'

import Truck from './Controls/Truck'

export default class World {
  constructor() {
    this.threeWorld = new ThreeWorld()
    this.scene = this.threeWorld.scene
    this.resources = this.threeWorld.resources

    // 准备需要控制的 object3d 对象
    this.truck = null
    this.truckPath = null

    this.resources.on('load', () => {
      this.createScene()
      this.runWorld()
    })
  }

  createScene() {
    this.environment = new Environment()

    const gltf = this.resources.items.gltfModel
    const sceneItem = []
    const truckPathPoints = []
    console.log(gltf.scene)
    gltf.scene.traverse(child => {
      // 路面
      if (hasIncludeMeshName(child.name, 'floor')) {
        child.geometry.computeBoundingBox()
        const {
          min,
          max
        } = child.geometry.boundingBox
        const gridHelper = new THREE.GridHelper(Math.abs(min.x) + Math.abs(max.x), 40, new THREE.Color(0x0e8ff8), new THREE.Color(0x0e8ff8))
        sceneItem.push(gridHelper)

        const floorColor = 0x0c0e6f
        const floorGeometry = child.geometry
        const floorMaterial = new THREE.MeshBasicMaterial({
          color: floorColor,
          transparent: true,
          opacity: 0.6
        })
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
        sceneItem.push(floorMesh)
      }

      // 树
      if (hasIncludeMeshName(child.name, 'tree')) {
        const treeMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(treeMesh)
      }

      // 路灯
      if (hasIncludeMeshName(child.name, 'street-light')) {
        const lightMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(lightMesh)
      }

      // 叉车
      if (hasIncludeMeshName(child.name, 'forklift')) {
        const forkliftMesh = convertObject3D(child, object3d => {
          const edges = new THREE.EdgesGeometry(object3d.geometry)
          const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1e90ff }))

          return lines
        })

        sceneItem.push(forkliftMesh)
      }

      // 卡车
      if (hasIncludeMeshName(child.name, 'truck')) {
        sceneItem.push(child)
        this.truck = new Truck(child)
      }

      // 卡车运动的曲线
      if (hasIncludeMeshName(child.name, 'truck-path-plan')) {
        const points = []
        const linePathPosition = child.geometry.attributes.position
        for (let i = 0; i < linePathPosition.count; i++) {
          points.push(new THREE.Vector3(
            linePathPosition.getX(i),
            linePathPosition.getY(i),
            linePathPosition.getZ(i)
          ))
        }

        // this.truckPath = new THREE.CatmullRomCurve3(points)
        console.log(child)
        // const points1 = this.truckPath.getPoints( 100 );
        // const geometry = new THREE.BufferGeometry().setFromPoints( points1 );
        // const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

        // sceneItem.push(new THREE.Line( geometry, material ))
        // sceneItem.push(child)
      }

      if (hasIncludeMeshName(child.name, 'truck-path')) {
        truckPathPoints[child.userData.index - 1] = child.position
      }

      // 卡车所在的路面
      if (hasIncludeMeshName(child.name, 'road')) {
        sceneItem.push(child)
      }

      // 光
      if (child.name === '日光') {
        sceneItem.push(child)
      }
    })

    // tmp
    // const c = new THREE.CatmullRomCurve3(truckPathPoints)
    // c.closed = true
    // c.tension = 1
    // const points1 = c.getPoints( 30 );
    // const geometry = new THREE.BufferGeometry().setFromPoints( points1 );
    // const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    // sceneItem.push(new THREE.Line( geometry, material ))
    // this.truckPath = c

    // const curve = new THREE.SplineCurve([
    //   new THREE.Vector2(truckPathPoints[0].x, truckPathPoints[0].z),
    //   new THREE.Vector2(truckPathPoints[1].x, truckPathPoints[1].z),
    //   new THREE.Vector2(truckPathPoints[2].x, truckPathPoints[2].z),
    //   new THREE.Vector2(truckPathPoints[3].x, truckPathPoints[3].z)
    // ])
    // const curve = new THREE.LineCurve3(
    //   new THREE.Vector3(truckPathPoints[0].x, truckPathPoints[0].y, truckPathPoints[0].z),
    //   new THREE.Vector3(truckPathPoints[1].x, truckPathPoints[1].y, truckPathPoints[1].z)
    // )
    // const points = curve.getPoints( 100 );
    // console.log(curve)
    // this.truckPath = curve

    // const points = curve.getPoints( 4 );
    // const geometry = new THREE.BufferGeometry().setFromPoints( points );
    // const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    // const splineObject = new THREE.Line( geometry, material )
    // splineObject.rotation.x = Math.PI * .5;
    // splineObject.position.y = 0.05;
    // sceneItem.push(splineObject)

    // console.log(splineObject)

    // const t = makeLineCurve3PathPointsByEmptyObject3D(truckPathPoints)
    // console.log(t)
    // this.truckPath = t

    // console.log(truckPathPoints);
    // const geometry = new THREE.BufferGeometry().setFromPoints(truckPathPoints)
    // console.log(geometry)

    // 添加 object3d 到场景中
    for (let item of sceneItem) {
      this.scene.add(item)
    }
  }

  runWorld() {
    this.truck.run(this.truckPath)
  }
}
