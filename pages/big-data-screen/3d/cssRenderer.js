import {
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {
  getCanvasWidthAndHeightAndSelf
} from './helper'

const {
  canvas
} = getCanvasWidthAndHeightAndSelf()

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvas.width, canvas.height);
canvas.parentElement.appendChild(labelRenderer.domElement)

labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.zIndex = '9';

export default labelRenderer