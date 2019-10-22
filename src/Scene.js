import React, { Suspense } from 'react'

export default function Scene({ children, fallback = null }) {
  return (
    <>
      <fog attach="fog" args={[0xefefef, 22.5, 30]} />
      <hemisphereLight intensity={0.3} />
      <pointLight intensity={0.7} position={[0, 200, 0]} />
      <pointLight intensity={0.8} position={[200, 10, 0]} />
      <pointLight intensity={0.8} position={[-200, 10, 0]} />
      <pointLight intensity={0.3} position={[0, 0, 100]} />
      <spotLight intensity={0.3} position={[0, 50, 50]} />
      <spotLight angle={Math.PI / 8} intensity={0.2} position={[20, 30, 20]} />
      <Suspense fallback={fallback}>{children}</Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
        <planeGeometry attach="geometry" args={[4, 1000]} />
        <meshBasicMaterial attach="material" color="lightcoral" fog={false} transparent opacity={0.4} />
      </mesh>
    </>
  )
}
