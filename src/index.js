import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useState, useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { useGesture } from 'react-use-gesture'
import { useSpring, a, config } from 'react-spring/three'
import Text from './helpers/Text'
import Scene from './Scene'
import useModel from './helpers/useModel'
import './styles.css'

const material = { transparent: true, roughness: 0.8, fog: true, shininess: 0, flatShading: false, emissive: '#070707' }

const Seat = ({ color, ...props }) => {
  const [geometries, center] = useModel('/seat.glb')
  const [hovered, set] = useState(false)
  const hover = e => e.stopPropagation() && set(true)
  const unhover = e => set(false)
  const { s, c } = useSpring({ s: hovered ? 1.2 : 1, c: hovered ? 'lightcoral' : color, config: config.stiff })
  return (
    <a.group {...props} onPointerOver={hover} onPointerOut={unhover} scale={s.interpolate(s => [s, s, 1])}>
      {geometries.map(geom => (
        <mesh key={geom.uuid} position={center} geometry={geom} castShadow receiveShadow>
          <a.meshPhysicalMaterial attach="material" {...material} roughness={1} shininess={0} color={c} />
        </mesh>
      ))}
    </a.group>
  )
}

const Quarter = ({ color, ...props }) => (
  <group {...props}>
    <Seat color={color} position={[-0.35, 0, 0.7]} />
    <Seat color={color} position={[0.35, 0, 0.7]} />
    <Seat color={color} position={[-0.35, 0, -0.7]} rotation={[0, Math.PI, 0]} />
    <Seat color={color} position={[0.35, 0, -0.7]} rotation={[0, Math.PI, 0]} />
  </group>
)

const Row = ({ color, ...props }) => (
  <group {...props}>
    <Text color="gray" size={0.15} position={[2.2, 2, 10.8]} rotation={[-Math.PI / 2, 0, 0]} children="1" />
    <Text color="gray" size={0.15} position={[2.2, 2, 10]} rotation={[-Math.PI / 2, 0, 0]} children="2" />
    <Text color="gray" size={0.15} position={[-2.2, 2, 10.8]} rotation={[-Math.PI / 2, 0, 0]} children="1" />
    <Text color="gray" size={0.15} position={[-2.2, 2, 10]} rotation={[-Math.PI / 2, 0, 0]} children="2" />
    <Quarter color={color} position={[-1.2, -0.45, 9.75]} />
    <Quarter color={color} position={[1.2, -0.45, 9.75]} />
  </group>
)

const Cabin = ({ color = 'white', seatColor = 'white', name, ...props }) => {
  const [geometries, center] = useModel('/cabin.glb')
  return (
    <group {...props}>
      <Text centerX={false} color="lightcoral" size={0.6} position={[2.6, 2, 10.6]} rotation={[-Math.PI / 2, 0, 0]}>
        {name}
      </Text>
      <group position={center}>
        {geometries.map((geom, index) => (
          <mesh key={geom.uuid} geometry={geom} castShadow receiveShadow>
            <meshPhysicalMaterial
              attach="material"
              {...material}
              color={index === 0 ? color : 'indianred'}
              opacity={index === 0 ? 1 : 0.2}
            />
          </mesh>
        ))}
      </group>
      <Row color={seatColor} />
      <Row color={seatColor} position={[0, 0, -1.9]} />
      <Row color={seatColor} position={[0, 0, -6.6]} />
      <Row color={seatColor} position={[0, 0, -8.5]} />
      <Row color={seatColor} position={[0, 0, -11]} />
      <Row color={seatColor} position={[0, 0, -12.9]} />
      <Row color={seatColor} position={[0, 0, -17.6]} />
      <Row color={seatColor} position={[0, 0, -19.5]} />
    </group>
  )
}

const App = () => {
  const [{ position }, set] = useSpring(() => ({ position: [0, 0, 0], config: config.slow }))
  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)
  const bind = useGesture({
    onWheel: ({ local: [, y] }) => (wheelOffset.current = y) && set({ position: [0, 0, ((dragOffset.current + y) / 500) * 25] }),
    onDrag: ({ local: [, y] }) => (dragOffset.current = y) && set({ position: [0, 0, ((wheelOffset.current + y) / 500) * 25] })
  })
  return (
    <Canvas
      {...bind()}
      camera={{ position: [0, 0, 10], fov: 65 }}
      gl={{ alpha: false }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color('#efefef')
        scene.rotation.set(Math.PI / 4, 0, 0)
      }}>
      <Scene fallback={null}>
        <a.group position={position}>
          <Cabin color="white" seatColor="lightskyblue" name="1A" position={[0, 0, -6]} />
          <Cabin color="lightgray" seatColor="gray" name="2B" position={[0, 0, -32]} />
          <Cabin color="white" seatColor="lightskyblue" name="3A" position={[0, 0, -58]} />
          <Cabin color="lightgray" seatColor="gray" name="4B" position={[0, 0, -84]} />
          <Cabin color="#676767" seatColor="sandybrown" name="5B" position={[0, 0, -110]} />
        </a.group>
      </Scene>
    </Canvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
