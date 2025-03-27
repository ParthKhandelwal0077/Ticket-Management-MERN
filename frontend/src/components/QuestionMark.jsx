import React, { useRef } from 'react'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import questionMarkModel from '../assets/models/question_mark_block_super_mario_bros.glb'

const Model = (props) => {
  const { nodes, materials } = useGLTF(questionMarkModel)
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005 // Slow rotation
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group position={[-35.116, 760.384, -5.424]} scale={[-1, 1, 372.566]}>
        <group position={[219.915, 0, 0.481]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Box005_09_-_Default_0'].geometry}
            material={materials['09_-_Default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Box005_03_-_Default_0'].geometry}
            material={materials['03_-_Default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Box005_02_-_Default_0'].geometry}
            material={materials['02_-_Default']}
          />
        </group>
      </group>
    </group>
  )
}

const QuestionMark = (props) => {
  return (
    <Canvas
      shadows
     
      style={{ background: 'transparent' }}
    >
      <perspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={1} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize={1024}
    
      />
      <Model position={[0, -3, -1]} scale={[0.005, 0.005, 0.005]} rotation={[0, Math.PI / 4, 0]} />
      <OrbitControls enableZoom={false} enablePan={false}  rota/>
    </Canvas>
  )
}

useGLTF.preload(questionMarkModel)
export default QuestionMark