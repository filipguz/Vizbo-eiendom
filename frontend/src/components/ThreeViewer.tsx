import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Project } from '../types'

interface Props {
  project: Project
}

export default function ThreeViewer({ project }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth || 600
    const h = container.clientHeight || 400

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x080e1c)
    scene.fog = new THREE.FogExp2(0x080e1c, 0.010)

    // Camera
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 600)
    camera.position.set(40, 30, 48)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.target.set(0, 10, 0)
    controls.minDistance = 18
    controls.maxDistance = 120
    controls.maxPolarAngle = Math.PI / 2.05
    camera.lookAt(controls.target)

    // Lights
    const ambient = new THREE.AmbientLight(0x304060, 0.8)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xfff0d8, 2.2)
    sun.position.set(25, 50, 18)
    sun.castShadow = true
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 250
    sun.shadow.camera.left = -60
    sun.shadow.camera.right = 60
    sun.shadow.camera.top = 60
    sun.shadow.camera.bottom = -60
    sun.shadow.mapSize.setScalar(2048)
    sun.shadow.bias = -0.0008
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0x1030a0, 0.35)
    fill.position.set(-30, 12, -25)
    scene.add(fill)

    // Ground
    const groundGeo = new THREE.PlaneGeometry(140, 140)
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x0c1520 })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Grid lines
    const grid = new THREE.GridHelper(140, 28, 0x152030, 0x0f1a28)
    grid.position.y = 0.015
    scene.add(grid)

    // Materials
    const mainMat = new THREE.MeshLambertMaterial({ color: 0xcdd8ea })
    const wingMat = new THREE.MeshLambertMaterial({ color: 0xb8c8dc })
    const podiumMat = new THREE.MeshLambertMaterial({ color: 0xa5b8cc })
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4a74b0, transparent: true, opacity: 0.7 })

    const addBox = (
      geo: THREE.BoxGeometry,
      mat: THREE.MeshLambertMaterial,
      x: number,
      y: number,
      z: number,
    ) => {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      const edges = new THREE.EdgesGeometry(geo)
      mesh.add(new THREE.LineSegments(edges, lineMat))
      return mesh
    }

    // Derive building dimensions from project data
    const mainH = project.floors * 3.2
    const footprint = Math.sqrt((project.bra / project.floors) * 1.25)
    const fw = Math.min(Math.max(footprint * 0.75, 10), 20)
    const fd = Math.min(Math.max(footprint * 0.55, 8), 15)

    // Main tower
    addBox(new THREE.BoxGeometry(fw, mainH, fd), mainMat, 0, mainH / 2, 0)

    // Side wing
    const wingH = Math.max(mainH * 0.58, 9)
    const wingW = fw * 0.7
    addBox(new THREE.BoxGeometry(wingW, wingH, fd * 1.45), wingMat, -(fw * 0.85 + wingW * 0.5), wingH / 2, fd * 0.22)

    // Low podium between the two
    const podH = Math.max(mainH * 0.18, 5)
    addBox(new THREE.BoxGeometry(fw * 0.55, podH, fd * 0.85), podiumMat, -(fw * 0.43), podH / 2, 0)

    // Small accent block on the right
    const accentH = Math.max(mainH * 0.35, 6)
    addBox(new THREE.BoxGeometry(fw * 0.45, accentH, fd * 0.9), wingMat, fw * 0.85, accentH / 2, -fd * 0.15)

    // Rooftop detail
    const roofH = mainH * 0.08
    addBox(new THREE.BoxGeometry(fw * 0.6, roofH, fd * 0.6), podiumMat, 0, mainH + roofH / 2, 0)

    // Label overlay (compass)
    const compassGeo = new THREE.CircleGeometry(2, 32)
    const compassMat = new THREE.MeshBasicMaterial({ color: 0x1a3a6a, transparent: true, opacity: 0.6 })
    const compass = new THREE.Mesh(compassGeo, compassMat)
    compass.rotation.x = -Math.PI / 2
    compass.position.set(30, 0.03, 30)
    scene.add(compass)

    // Animation
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      if (nw === 0 || nh === 0) return
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [project.id])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" />
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-900/70 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-800">
        <span>Prinsippmodell — ikke målfast</span>
      </div>
      <div className="absolute top-3 right-3 text-[10px] text-gray-600 bg-gray-900/70 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-800">
        Dra for å rotere · Scroll for zoom
      </div>
    </div>
  )
}
