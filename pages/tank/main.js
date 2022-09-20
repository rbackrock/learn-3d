import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const infoElem = document.createElement('div')
infoElem.id="info"
document.body.insertAdjacentElement('afterbegin', infoElem)
// const infoElem = document.querySelector('#info');
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xAAAAAA)
renderer.shadowMap.enabled = true
document.body.insertAdjacentElement('afterbegin', renderer.domElement)

// 场景
const scene = new THREE.Scene()

// 创建相机
function makeCamera(fov = 40) {
  const aspect = 2
  const zNear = 0.1
  const zFar = 1000
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar)
}
const camera = makeCamera()
camera.position.set(8, 4, 10).multiplyScalar(3)
camera.lookAt(0, 0, 0)

// 创建光
{
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 20, 0);
  scene.add(light);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  const d = 50;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 50;
  light.shadow.bias = 0.001;
}

{
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 2, 4);
  scene.add(light);
}

// 辅助：控制器，坐标轴
const axesHelper = new THREE.AxesHelper(10)
const controls = new OrbitControls(camera, renderer.domElement)
scene.add(axesHelper)

// --- 创建地面
function createGround() {
  const groundGeometry = new THREE.PlaneGeometry(50, 50)
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0xCC8866
  })
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
  groundMesh.rotation.x = Math.PI * -.5
  // 是否接收阴影
  groundMesh.receiveShadow = true

  return groundMesh
}
// --- end 创建地面

// --- 创建坦克线路
const curve = new THREE.SplineCurve( [
  new THREE.Vector2( -10, 0 ),
  new THREE.Vector2( -5, 5 ),
  new THREE.Vector2( 0, 0 ),
  new THREE.Vector2( 5, -5 ),
  new THREE.Vector2( 10, 0 ),
  new THREE.Vector2( 5, 10 ),
  new THREE.Vector2( -5, 10 ),
  new THREE.Vector2( -10, -10 ),
  new THREE.Vector2( -15, -8 ),
  new THREE.Vector2( -10, 0 ),
] );

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
const splineObject = new THREE.Line( geometry, material );
splineObject.rotation.x = Math.PI * .5;
splineObject.position.y = 0.05;
scene.add(splineObject);
// --- end 创建坦克线路

// --- 创建坦克
function createTank() {
  const tank = new THREE.Object3D()

  // 坦克体
  const carWidth = 4;
  const carHeight = 1;
  const carLength = 8;
  const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength)
  const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x6688AA})
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
  bodyMesh.position.y = 1.4
  // 是否渲染到阴影贴图中
  bodyMesh.castShadow = true
  tank.add(bodyMesh)

  const tankCameraFov = 75;
  const tankCamera = makeCamera(tankCameraFov);
  tankCamera.position.y = 3;
  tankCamera.position.z = -6;
  tankCamera.rotation.y = Math.PI;
  bodyMesh.add(tankCamera);
  // end 坦克体

  // 坦克轮子
  const wheelRadius = 1 // 轮子半径
  const wheelThickness = 0.5 // 轮子厚度
  const wheelSegments = 6 // 轮子分形
  const wheelGeometry = new THREE.CylinderGeometry(
    wheelRadius,     // top radius
    wheelRadius,     // bottom radius
    wheelThickness,  // height of cylinder
    wheelSegments)
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888
  })
  const wheelPositions = [
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2,  carLength / 3],
    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2,  carLength / 3],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
  ];
  const wheelMeshes = wheelPositions.map((position) => {
    const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
    mesh.position.set(...position)
    // 默认圆柱体翻转
    mesh.rotation.z = Math.PI * 0.5
    mesh.castShadow = true
    bodyMesh.add(mesh)
    return mesh
  });
  // end 坦克轮子

  // 坦克圆顶
  const domeRadius = 2;
  const domeWidthSubdivisions = 12;
  const domeHeightSubdivisions = 12;
  const domePhiStart = 0;
  const domePhiEnd = Math.PI * 2;
  const domeThetaStart = 0;
  const domeThetaEnd = Math.PI * .5;
  const domeGeometry = new THREE.SphereGeometry(
    domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
    domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd
  );
  const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
  domeMesh.castShadow = true;
  bodyMesh.add(domeMesh);
  domeMesh.position.y = .5;
  // end 坦克圆顶

  // 坦克炮管
  const turretWidth = .1;
  const turretHeight = .1;
  const turretLength = carLength * .75 * .2;
  const turretGeometry = new THREE.BoxGeometry(
    turretWidth,
    turretHeight,
    turretLength
  );
  const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
  const turretPivot = new THREE.Object3D();
  turretMesh.castShadow = true;
  turretPivot.scale.set(5, 5, 5);
  turretPivot.position.y = .5;
  turretMesh.position.z = turretLength * .5;
  turretPivot.add(turretMesh);
  bodyMesh.add(turretPivot);

  // 创建炮管相机
  const turretCamera = makeCamera();
  turretCamera.position.y = .75 * .2;
  turretMesh.add(turretCamera);
  // end 坦克炮管

  return {
    tank,
    wheelMeshes,
    carLength,
    turretPivot,
    turretCamera,
    tankCamera
  }
}
// --- end 创建坦克

// --- 创建攻击目标
function createAttackTarget(carLength) {
  const targetGeometry = new THREE.SphereGeometry(.5, 6, 3);
  const targetMaterial = new THREE.MeshPhongMaterial({color: 0x00FF00, flatShading: true});
  const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
  const targetOrbit = new THREE.Object3D();
  const targetElevation = new THREE.Object3D();
  const targetBob = new THREE.Object3D();
  targetMesh.castShadow = true;
  // scene.add(targetOrbit);
  targetOrbit.add(targetElevation);
  targetElevation.position.z = carLength * 2;
  targetElevation.position.y = 8;
  targetElevation.add(targetBob);
  targetBob.add(targetMesh);

  const targetCamera = makeCamera();
  const targetCameraPivot = new THREE.Object3D();
  targetCamera.position.y = 1;
  targetCamera.position.z = -2;
  targetCamera.rotation.y = Math.PI;
  targetBob.add(targetCameraPivot);
  targetCameraPivot.add(targetCamera);

  return {
    targetOrbit,
    targetBob,
    targetElevation,
    targetMesh,
    targetMaterial,
    targetCamera,
    targetCameraPivot
  }
}
// --- end 创建攻击目标

const {
  tank,
  wheelMeshes,
  carLength,
  turretPivot,
  turretCamera,
  tankCamera
} = createTank()
const {
  targetOrbit,
  targetBob,
  targetElevation,
  targetMesh,
  targetMaterial,
  targetCamera,
  targetCameraPivot
} = createAttackTarget(carLength)
scene.add(createGround())
scene.add(tank)
scene.add(targetOrbit)

// 创建相机群
const cameras = [
  { cam: camera, desc: 'detached camera', },
  { cam: turretCamera, desc: 'on turret looking at target', },
  { cam: targetCamera, desc: 'near target looking at tank', },
  { cam: tankCamera, desc: 'above back of tank', },
]

function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    cameras.forEach((cameraInfo) => {
      const camera = cameraInfo.cam;
      console.log(camera)
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  }

  // 轮子动起来
  wheelMeshes.forEach((obj) => {
    obj.rotation.x = time * 3;
  })

  // 坦克按照绘制曲线的线路进行移动
  const tankPosition = new THREE.Vector2();
  const tankTarget = new THREE.Vector2();
  const tankTime = time * .05;
  curve.getPointAt(tankTime % 1, tankPosition);
  curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
  tank.position.set(tankPosition.x, 0, tankPosition.y);
  tank.lookAt(tankTarget.x, 0, tankTarget.y);

  // 让攻击目标动起来
  targetOrbit.rotation.y = time * .27;
  targetBob.position.y = Math.sin(time * 2) * 4;
  targetMesh.rotation.x = time * 7;
  targetMesh.rotation.y = time * 13;
  targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25);
  targetMaterial.color.setHSL(time * 10 % 1, 1, .25);

  // 坦克炮管跟随目标移动
  const targetPosition = new THREE.Vector3();
  targetMesh.getWorldPosition(targetPosition);
  turretPivot.lookAt(targetPosition);
  
  const camera = cameras[time * .25 % cameras.length | 0];
  infoElem.textContent = camera.desc;

  renderer.render(scene, camera.cam)
  controls.update()
  requestAnimationFrame(render)
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const needResize = canvas.width !== width || canvas.height !== height;

  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

requestAnimationFrame(render)