import * as THREE from 'three'

export default function createFloor(w, h) {
  const color = 0x1dc7ff // 0x2b4dff 0x0c0e6f
  const gridHelper = new THREE.GridHelper(50, 50, color, color)

  const geometry = new THREE.PlaneGeometry(25, 25);
  geometry.rotateX(Math.PI / 180 * 90)
  const material = new THREE.MeshBasicMaterial( {color: 0x0c0e6f, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );

  return gridHelper
}