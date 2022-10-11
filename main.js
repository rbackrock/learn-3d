const menus = [
  {
    name: 'big-data-screen',
    url: '/pages/big-data-screen/index.html'
  },
  {
    name: 'demo',
    url: '/pages/demo/index.html'
  },
  {
    name: 'learn-shader',
    url: '/pages/learn-shader/index.html'
  },
  {
    name: 'tank',
    url: '/pages/tank/index.html'
  },
  {
    name: 'threejs-init',
    url: '/pages/threejs-init/index.html'
  },
  {
    name: 'webgl',
    url: '/pages/webgl/index.html'
  },
  {
    name: 'babylonjs',
    url: '/pages/babylonjs/index.html'
  }
]

for (let i = 0; i < menus.length; i++) {
  const currentMenu = menus[i]

  const liElement = document.createElement('li')
  const aElement = document.createElement('a')

  aElement.href = currentMenu.url
  aElement.innerText = currentMenu.name
  liElement.className = 'item'
  liElement.appendChild(aElement)
  document.querySelector('#menus-hook').appendChild(liElement)
}
