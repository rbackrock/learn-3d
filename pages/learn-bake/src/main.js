import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * 设备宽高
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// 使用加载器提示
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
  document.querySelector('#loading').style.display = 'none'
}

// 材质加载器
const textureLoader = new THREE.TextureLoader(loadingManager)
// 模型压缩加载器
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('/draco/')
// 模型j卡再起
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * 纹理
 */
// const bakedTexture = textureLoader.load('/learn-bake/bake.jpg')
const bakedTexture = textureLoader.load('http://cdn.rback.fun/learn-bake/bake.jpg')
// 蛋疼，threejs 向上是 Y 坐标，blender 是 z 坐标
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * 烘焙材质
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * 添加萤火虫，粒子示例
 */
const firefliesGeometry = new THREE.BufferGeometry()
// 30 个萤火虫
const firefliesCount = 30
// 顶点位置描述是 xyz 所有要乘以3
const firefliesPosition = new Float32Array(firefliesCount * 3)
for(let i = 0; i < firefliesCount; i++) {
  // 在 blender 建模的时候，地板大小是 4x4 个单位
  firefliesPosition[i * 3 + 0] = (Math.random() - 0.5) * 4
  firefliesPosition[i * 3 + 1] = Math.random() * 1.5
  firefliesPosition[i * 3 + 2] = (Math.random() - 0.5) * 4
}
// 用用随机生成的坐标关联到位置属性上
firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(firefliesPosition, 3))

/**
 * 着色器编程
 */

// 顶点着色器
const vertexShader = `
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;
  attribute float aScale;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_PointSize = uSize * uPixelRatio * aScale;
    gl_Position = projectionPosition;
    // 实现萤火虫粒子有大小衰减
    gl_PointSize *= (1.0 / - viewPosition.z);
  }
`

const fragmentShader = `
  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
  }
`

/**
 * 创造每个顶点随机大小
 */
const randomScaleArray = new Float32Array(firefliesCount)
for(let i = 0; i < firefliesCount; i++) {
  randomScaleArray[i] = Math.random()
}

/**
 * 神秘力量的门
 */
const portalVertexShader = `
  varying vec2 vUv;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
  }
`

const portalFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;

  // 抄来的公式方法
  //	Classic Perlin 3D Noise 
  //	by Stefan Gustavson
  //
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P)
  {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    
    return 2.2 * n_xyz;
  }

  void main() {
    vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

    float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

    gl_FragColor = vec4(strength, strength, strength, 1.0);

    float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
    strength += outerGlow;

    gl_FragColor = vec4(strength, strength, strength, 1.0);

    strength += step(- 0.2, strength) * 0.8;

    vec3 color = mix(uColorStart, uColorEnd, strength);
    gl_FragColor = vec4(color, 1.0);
  }
`

const portalLightMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  // 每帧花费时间用作动画
  uniforms: {
    uTime: {
      value: 0
    },
    uColorStart: {
      value: new THREE.Color(0xffffff)
    },
    uColorEnd: {
      value: new THREE.Color(0x2abaff)
    }
  }
})

// gltfLoader.load('/learn-bake/learn-bake1.glb', gltf => {
gltfLoader.load('http://cdn.rback.fun/learn-bake/learn-bake-fix.glb', gltf => {
    gltf.scene.traverse(child => {
      child.material = bakedMaterial

      if (child.name === '圆环') {
        child.material = portalLightMaterial
      }
    })

    scene.add(gltf.scene)

    console.log(gltf.scene)
  }
)

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
setCamera(camera, sizes)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
// 阻尼
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * 大概比划横屏或者竖屏时相机的位置
 */
function setCamera(camera, { width, height }) {
  if (width > height) {
    // 横屏
    camera.position.x = -3.8
    camera.position.y = 2.04
    camera.position.z = -3.59
  } else {
    // 竖屏
    camera.position.x = -10.6
    camera.position.y = 5.6
    camera.position.z = -10
  }
}

// ...
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(randomScaleArray, 1))

const firefliesMaterial = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  vertexShader,
  fragmentShader,
  uniforms: {
    // 传递给着色器的是设备像素比，保证在高分辨率下的顶点大小一致
    uPixelRatio: {
      value: Math.min(window.devicePixelRatio, 2)
    },
    // 粒子大小
    uSize: {
      value: 160
    },
    // 每帧花费时间用作动画
    uTime: {
      value: 0
    }
  }
})

// 点材质表现萤火虫
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

// --------------------------------

const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  controls.update()

  renderer.render(scene, camera)

  // 为了萤火虫动画
  firefliesMaterial.uniforms.uTime.value = elapsedTime
  // 为了神秘力量的门动画
  portalLightMaterial.uniforms.uTime.value = elapsedTime

  window.requestAnimationFrame(tick)
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  setCamera(camera, sizes)

  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

// run
tick()