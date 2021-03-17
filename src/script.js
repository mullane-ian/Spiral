import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 300})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * GALAXY
 */
const parameters = {}
//number of particles
parameters.count = 100000
//Size of particles
parameters.size = 0.01

//radius of the galaxy
parameters.radius = 16.63

parameters.branches = 13

//rotation of the galaxy
parameters.spin = 0.07



let geometry = null
let material = null
let points = null

const generateGalaxy = () => 
{
    //destroy old galaxy when we create a new one
    if(points !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }


    geometry = new THREE.BufferGeometry()
    //Three values per vertext for the positions
    const positions = new Float32Array(parameters.count * 3)

    for(let i = 0; i < parameters.count; i++){
        //if we dont do this we will only fill a third of the array 
        // we need to fill X Y and Z
        const i3 = i*3

        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = ((i % parameters.branches) / parameters.branches) * 2 * Math.PI



        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius

    }
    geometry.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3)
    )


    /**
     * Material
     */
    material = new THREE.PointsMaterial(
        {
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        }
    )
    /**
     * Add Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}


generateGalaxy()

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 5.2
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    camera.position.y = Math.sin(elapsedTime*3) + 4
    // Render
    renderer.render(scene, camera)
    console.log(camera.position)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()