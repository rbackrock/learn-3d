export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            '/fox/static/textures/environmentMap/px.jpg',
            '/fox/static/textures/environmentMap/nx.jpg',
            '/fox/static/textures/environmentMap/py.jpg',
            '/fox/static/textures/environmentMap/ny.jpg',
            '/fox/static/textures/environmentMap/pz.jpg',
            '/fox/static/textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: '/fox/static/textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: '/fox/static/textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: '/fox/static/models/Fox/glTF-Binary/Fox.glb'
    }
]