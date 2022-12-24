const menus = [
  {
    name: '动态生成房屋',
    url: '/pages/big-data-screen/index.html'
  },
  {
    name: 'threejs初始化',
    url: '/pages/demo/index.html'
  },
  {
    name: 'shader试验田',
    url: '/pages/learn-shader/index.html'
  },
  {
    name: 'threejs坦克案例',
    url: '/pages/tank/index.html'
  },
  {
    name: 'home-3d',
    url: '/pages/home-3d/index.html'
  },
  {
    name: 'threejs初始化Class风格',
    url: '/pages/threejs-init-class/index.html'
  },
  {
    name: '线框风格仓库',
    url: '/pages/warehouse/index.html'
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
