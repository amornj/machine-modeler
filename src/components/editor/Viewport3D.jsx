import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Html } from '@react-three/drei';
import { PartMesh } from './PartMeshes';
import * as THREE from 'three';

// Part with Transform Controls
function TransformablePart({ part, isSelected, onSelect, activeTool, onUpdatePosition, orbitControlsRef }) {
  const meshRef = useRef();
  const transformRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (transformRef.current && orbitControlsRef.current) {
      const controls = transformRef.current;
      const orbitControls = orbitControlsRef.current;
      
      const onDragStart = () => {
        orbitControls.enabled = false;
      };
      
      const onDragEnd = () => {
        orbitControls.enabled = true;
        if (meshRef.current) {
          onUpdatePosition({
            x: meshRef.current.position.x,
            y: meshRef.current.position.y,
            z: meshRef.current.position.z
          });
        }
      };
      
      controls.addEventListener('dragging-changed', (e) => {
        if (e.value) onDragStart();
        else onDragEnd();
      });
    }
  }, [onUpdatePosition, orbitControlsRef]);

  const mode = activeTool === 'select' ? 'translate' : 
               activeTool === 'translate' ? 'translate' :
               activeTool === 'rotate' ? 'rotate' :
               activeTool === 'scale' ? 'scale' : 'translate';

  return (
    <group
      ref={meshRef}
      position={[part.position.x, part.position.y, part.position.z]}
      rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
      scale={[part.scale.x, part.scale.y, part.scale.z]}
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
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <PartMesh type={part.type} isSelected={isSelected || hovered} />
      
      {isSelected && (
        <TransformControls
          ref={transformRef}
          mode={mode}
          size={0.8}
          showX={true}
          showY={true}
          showZ={true}
        />
      )}
    </group>
  );
}



// Simple Grid Component
function SimpleGrid() {
  const gridHelper = useMemo(() => {
    return new THREE.GridHelper(20, 40, '#2a2a4e', '#1a1a2e');
  }, []);
  
  return <primitive object={gridHelper} />;
}

// Scene content
function Scene({ parts, selectedPart, onSelectPart, activeTool, showGrid, onUpdatePart }) {
  const orbitControlsRef = useRef();
  
  return (
    <>
      <color attach="background" args={['#0a0a12']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      {showGrid && <SimpleGrid />}
      
      {parts.map(part => (
        <TransformablePart
          key={part.id}
          part={part}
          isSelected={selectedPart === part.id}
          onSelect={onSelectPart}
          activeTool={activeTool}
          onUpdatePosition={(pos) => onUpdatePart(part.id, { position: pos })}
          orbitControlsRef={orbitControlsRef}
        />
      ))}
      
      <OrbitControls 
        ref={orbitControlsRef}
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