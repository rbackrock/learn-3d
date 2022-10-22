import * as THREE from 'three'
import gsap from "gsap";

export default function modifyShader(mesh) {
  mesh.geometry.computeBoundingBox()
  const { min, max } = mesh.geometry.boundingBox
  const modelHeight = max.y - min.y

  mesh.material.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
        #include <dithering_fragment>
        //#end#
    `
    )

    addGradientColor(shader, '#b5b8ff', modelHeight)
    addToTopLine(shader)
  }
}

// 添加颜色渐变
export function addGradientColor(shader, topColor = '#ffffff', modelHeight) {
  shader.uniforms.uTopColor = {
    value: new THREE.Color(topColor) // 0x1dc7ff aaaeff
  }
  shader.uniforms.uHeight = {
    value: modelHeight
  }

  // 修改顶点着色器
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `
      #include <common>
      varying vec3 vPosition;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    `#include <begin_vertex>`,
    `
      #include <begin_vertex>
      vPosition = position;
    `
  )

  // 修改片源着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    `#include <common>`,
    `
      #include <common>
      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;
    `
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    `#include <dithering_fragment>`,
    `
      #include <dithering_fragment>
      vec4 gradientColor = gl_FragColor;

      float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
      // float gradMix = vPosition.y / uHeight;
      vec3 gradMixColor = mix(gradientColor.xyz, uTopColor, gradMix);
      gl_FragColor = vec4(gradMixColor, 1.0);
    `
  )
}

// 添加从底部到顶部的光圈
export function addToTopLine(shader) {
  //   扩散的时间
  shader.uniforms.uToTopTime = { value: 0 }
  //   设置条带的宽度
  shader.uniforms.uToTopWidth = { value: 0.02 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      
      uniform float uToTopTime;
      uniform float uToTopWidth;
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
      float ToTopMix = -(vPosition.y - uToTopTime) * (vPosition.y - uToTopTime) + uToTopWidth;

      if(ToTopMix > 0.0){
          // gl_FragColor = mix(gl_FragColor, vec4(0.05, 0.56, 0.97, 0.3), ToTopMix / uToTopWidth);
          gl_FragColor = mix(gl_FragColor, vec4(1, 1, 1, 0.6), ToTopMix / uToTopWidth);
      }

      //#end#
    `
  )

  gsap.to(shader.uniforms.uToTopTime, {
    value: 10,
    duration: 2.3,
    ease: "none",
    repeat: -1,
  })
}