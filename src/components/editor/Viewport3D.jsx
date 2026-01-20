import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { PartMesh } from './PartMeshes';
import * as THREE from 'three';

// Transform gizmo for selected parts
function TransformGizmo({ position, activeTool, onMove }) {
  const groupRef = useRef();
  const [dragging, setDragging] = useState(null);
  const [startPos, setStartPos] = useState(null);
  
  if (activeTool === 'select') return null;
  
  return (
    <group ref={groupRef} position={position}>
      {activeTool === 'translate' && (
        <>
          {/* X axis */}
          <mesh 
            position={[0.5, 0, 0]}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDragging('x');
              setStartPos(e.point.clone());
            }}
          >
            <boxGeometry args={[1, 0.05, 0.05]} />
            <meshBasicMaterial color="#ff4444" transparent opacity={0.8} />
          </mesh>
          <mesh position={[1, 0, 0]}>
            <coneGeometry args={[0.1, 0.2, 8]} rotation={[0, 0, -Math.PI / 2]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
          
          {/* Y axis */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.05, 1, 0.05]} />
            <meshBasicMaterial color="#44ff44" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.1, 0.2, 8]} />
            <meshBasicMaterial color="#44ff44" />
          </mesh>
          
          {/* Z axis */}
          <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[0.05, 0.05, 1]} />
            <meshBasicMaterial color="#4444ff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.2, 8]} />
            <meshBasicMaterial color="#4444ff" />
          </mesh>
        </>
      )}
    </group>
  );
}

// Individual part in the scene
function Part({ part, isSelected, onSelect, activeTool, onUpdatePosition }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(part.position.x, part.position.y, part.position.z);
      meshRef.current.rotation.set(part.rotation.x, part.rotation.y, part.rotation.z);
      meshRef.current.scale.set(part.scale.x, part.scale.y, part.scale.z);
    }
  });
  
  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(part.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <PartMesh type={part.type} isSelected={isSelected} />
      {(hovered || isSelected) && (
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial 
            color={isSelected ? "#00d9ff" : "#ffffff"} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      )}
    </group>
  );
}



// Scene content
function Scene({ parts, selectedPart, onSelectPart, activeTool, showGrid, onUpdatePart }) {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      {showGrid && (
        <gridHelper args={[20, 40, '#2a2a4e', '#1a1a2e']} />
      )}
      
      {parts.map(part => (
        <Part
          key={part.id}
          part={part}
          isSelected={selectedPart === part.id}
          onSelect={onSelectPart}
          activeTool={activeTool}
          onUpdatePosition={(pos) => onUpdatePart(part.id, { position: pos })}
        />
      ))}
      
      {selectedPart && (
        <TransformGizmo
          position={parts.find(p => p.id === selectedPart)?.position || { x: 0, y: 0, z: 0 }}
          activeTool={activeTool}
        />
      )}
      
      <OrbitControls 
        makeDefault 
        enableDamping 
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={50}
      />
    </>
  );
}

// Loading fallback
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-white/60 text-sm">Loading viewport...</span>
      </div>
    </Html>
  );
}

export default function Viewport3D({ 
  parts, 
  selectedPart, 
  onSelectPart, 
  activeTool, 
  showGrid,
  onUpdatePart 
}) {
  return (
    <div className="w-full h-full bg-[#0a0a12]">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={() => onSelectPart(null)}
      >
        <Suspense fallback={<Loader />}>
          <Scene
            parts={parts}
            selectedPart={selectedPart}
            onSelectPart={onSelectPart}
            activeTool={activeTool}
            showGrid={showGrid}
            onUpdatePart={onUpdatePart}
          />
        </Suspense>
      </Canvas>
      
      {/* Viewport overlay info */}
      <div className="absolute bottom-4 left-4 text-xs text-white/40 space-y-1">
        <p>LMB: Rotate • RMB: Pan • Scroll: Zoom</p>
        <p>Click part to select • Click empty to deselect</p>
      </div>
    </div>
  );
}