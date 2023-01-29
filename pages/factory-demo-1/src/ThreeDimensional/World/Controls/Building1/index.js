import * as THREE from 'three'
import gsap from 'gsap'

export default class Building1 {
  constructor(mesh) {
    this.mesh = mesh
    this.VERTEXT_DECLARE_END_FLAG = '// VERTEXT_DECLARE_END_FLAG'
    this.VERTEXT_EDIT_END_FLAG = '// VERTEXT_EDIT_END_FLAG'
    this.FRAGMENT_DECLARE_END_FLAG = '// FRAGMENT_DECLARE_END_FLAG'
    this.FRAGMENT_EDIT_END_FLAG = '// FRAGMENT_EDIT_END_FLAG'

    this.scanLineAnimation = null

    this.addEffects()
  }

  addEffects() {
    this.mesh.material = new THREE.MeshBasicMaterial({
      color: 0x0C0E6F
    })

    this.mesh.material.onBeforeCompile = shader => {
      this.initEffects(shader)
      this.addGradientColorEffects(shader)
      this.addScanLineEffects(shader)
    }
  }

  initEffects(shader) {
    // 顶点着色器声明
    shader.vertexShader = shader.vertexShader.replace(
      `#include <common>`,
      `
        #include <common>
        ${this.VERTEXT_DECLARE_END_FLAG}
      `
    )

    // 顶点着色器逻辑
    shader.vertexShader = shader.vertexShader.replace(
      `#include <fog_vertex>`,
      `
        #include <fog_vertex>
        ${this.VERTEXT_EDIT_END_FLAG}
      `
    )

    // 片元着色器声明
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <common>`,
      `
        #include <common>
        ${this.FRAGMENT_DECLARE_END_FLAG}
      `
    )

    // 片元着色器逻辑
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `
        #include <dithering_fragment>
        ${this.FRAGMENT_EDIT_END_FLAG}
      `
    )
  }

  // 添加渐变效果
  addGradientColorEffects(shader) {
    const geometry = this.mesh.geometry
    geometry.computeBoundingBox()
    const { min, max } = geometry.boundingBox
    const uHeight = max.y - min.y

    // 模型最大高度
    shader.uniforms.uHeightGradientColor = {
      value: uHeight
    }
    // 模型顶部部分的颜色
    shader.uniforms.uTopColorGradientColor = {
      value: new THREE.Color('#ffffff')
    }

    // 顶点着色器声明
    shader.vertexShader = shader.vertexShader.replace(
      `${this.VERTEXT_DECLARE_END_FLAG}`,
      `
        varying vec3 vPositionGradientColor;
        ${this.VERTEXT_DECLARE_END_FLAG}
      `
    )

    // 顶点着色器逻辑
    shader.vertexShader = shader.vertexShader.replace(
      `${this.VERTEXT_EDIT_END_FLAG}`,
      `
        vPositionGradientColor = position;
        ${this.VERTEXT_EDIT_END_FLAG}
      `
    )

    // 片元着色器声明
    shader.fragmentShader = shader.fragmentShader.replace(
      `${this.FRAGMENT_DECLARE_END_FLAG}`,
      `
        varying vec3 vPositionGradientColor;
        uniform float uHeightGradientColor;
        uniform vec3 uTopColorGradientColor;
        ${this.FRAGMENT_DECLARE_END_FLAG}
      `
    )

    // 片元着色器逻辑
    shader.fragmentShader = shader.fragmentShader.replace(
      `${this.FRAGMENT_EDIT_END_FLAG}`,
      `
        vec4 distGradColor = gl_FragColor;
        float gradMixPercentage = (vPositionGradientColor.y + uHeightGradientColor / 2.0) / uHeightGradientColor;
        vec3 gradMixColor = mix(distGradColor.xyz, uTopColorGradientColor, gradMixPercentage);
        gl_FragColor = vec4(gradMixColor, 1);
        ${this.FRAGMENT_EDIT_END_FLAG}
      `
    )
  }

  // scan line
  addScanLineEffects(shader) {
    shader.uniforms.uTimeScanLine = {
      value: 0
    }
    shader.uniforms.uTopWidthScanLine = {
      value: 0.03
    }

    // 顶点着色器声明
    shader.vertexShader = shader.vertexShader.replace(
      `${this.VERTEXT_DECLARE_END_FLAG}`,
      `
        varying vec3 vPositionScanLine;
        ${this.VERTEXT_DECLARE_END_FLAG}
      `
    )

    // 顶点着色器逻辑
    shader.vertexShader = shader.vertexShader.replace(
      `${this.VERTEXT_EDIT_END_FLAG}`,
      `
        vPositionScanLine = position;
        ${this.VERTEXT_EDIT_END_FLAG}
      `
    )

    // 片元着色器声明
    shader.fragmentShader = shader.fragmentShader.replace(
      `${this.FRAGMENT_DECLARE_END_FLAG}`,
      `
        varying vec3 vPositionScanLine;
        uniform float uTimeScanLine;
        uniform float uTopWidthScanLine;
        ${this.FRAGMENT_DECLARE_END_FLAG}
      `
    )

    // 片元着色器逻辑
    shader.fragmentShader = shader.fragmentShader.replace(
      `${this.FRAGMENT_EDIT_END_FLAG}`,
      `
        float toTopMix = -(vPositionScanLine.y - uTimeScanLine) * (vPositionScanLine.y - uTimeScanLine) + uTopWidthScanLine;
        if(toTopMix > 0.0){
          gl_FragColor = mix(gl_FragColor, vec4(0.05, 0.56, 0.97, 1.0), toTopMix / uTopWidthScanLine);
        }
        ${this.FRAGMENT_EDIT_END_FLAG}
      `
    )

    this.scanLineAnimation = gsap.to(shader.uniforms.uTimeScanLine, {
      value: 16,
      duration: 3,
      ease: 'none',
      repeat: -1
    })
  }

  destroy() {
    if (this.this.scanLineAnimation) {
      this.this.scanLineAnimation.kill()
      this.this.scanLineAnimation = null
    }
  }
}