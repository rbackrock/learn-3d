import { resolve } from 'path'
import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  build: {
    rollupOptions: {
      input: {
        'big-data-screen': resolve(__dirname, 'pages/big-data-screen/index.html'),
        'tank': resolve(__dirname, 'pages/tank/index.html'),
        'demo': resolve(__dirname, 'pages/demo/index.html'),
        'home-3d': resolve(__dirname, 'pages/home-3d/index.html'),
        'threejs-init-class': resolve(__dirname, 'pages/threejs-init-class/index.html'),
        'fox': resolve(__dirname, 'pages/fox/index.html'),
        'warehouse': resolve(__dirname, 'pages/warehouse/index.html'),
        'exercise1': resolve(__dirname, 'pages/exercise1/index.html'),
        'learn-bake': resolve(__dirname, 'pages/learn-bake/index.html'),
        'conveyor-belt': resolve(__dirname, 'pages/conveyor-belt/index.html'),
        'factory-demo-1': resolve(__dirname, 'pages/factory-demo-1/index.html'),
        'canvas-texture': resolve(__dirname, 'pages/canvas-texture/index.html'),
        'shader': resolve(__dirname, 'pages/shader/index.html'),
        'experiment': resolve(__dirname, 'pages/experiment/index.html'),
        'particle': resolve(__dirname, 'pages/particle/index.html')
      }
    }
  }
})