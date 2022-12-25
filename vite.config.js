import { resolve } from 'path'
import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  build: {
    rollupOptions: {
      input: {
        'big-data-screen': resolve(__dirname, 'pages/big-data-screen/index.html'),
        'shader': resolve(__dirname, 'pages/learn-shader/index.html'),
        'tank': resolve(__dirname, 'pages/tank/index.html'),
        'demo': resolve(__dirname, 'pages/demo/index.html'),
        'home-3d': resolve(__dirname, 'pages/home-3d/index.html'),
        'threejs-init-class': resolve(__dirname, 'pages/threejs-init-class/index.html'),
        'warehouse': resolve(__dirname, 'pages/warehouse/index.html'),
        'exercise1': resolve(__dirname, 'pages/exercise1/index.html')
      }
    }
  }
})