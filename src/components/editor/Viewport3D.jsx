import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Html } from '@react-three/drei';
import { useTheme } from 'next-themes';
import { PartMesh } from './PartMeshes';
import * as THREE from 'three';

// Part with Transform Controls
function TransformablePart({ part, isSelected, onSelect, activeTool, onUpdatePosition, orbitControlsRef }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const mode = activeTool === 'select' ? 'translate' : 
               activeTool === 'translate' ? 'translate' :
               activeTool === 'rotate' ? 'rotate' :
               activeTool === 'scale' ? 'scale' : 'translate';

  return (
    <group>
      <TransformControls
        mode={isSelected ? mode : 'translate'}
        enabled={isSelected}
        onObjectChange={() => {
          if (meshRef.current) {
            onUpdatePosition({
              x: meshRef.current.position.x,
              y: meshRef.current.position.y,
              z: meshRef.current.position.z
            });
          }
        }}
      >
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
        </group>
      </TransformControls>
    </group>
  );
}



// Simple Grid Component
function SimpleGrid({ isDark }) {
  const gridHelper = useMemo(() => {
    const primaryColor = isDark ? '#2a2a4e' : '#c0c0c0';
    const secondaryColor = isDark ? '#1a1a2e' : '#e0e0e0';
    return new THREE.GridHelper(20, 40, primaryColor, secondaryColor);
  }, [isDark]);

  return <primitive object={gridHelper} />;
}

// Scene content
function Scene({ parts, selectedPart, onSelectPart, activeTool, showGrid, onUpdatePart, isDark }) {
  const orbitControlsRef = useRef();
  const backgroundColor = isDark ? '#0a0a12' : '#f5f5f5';

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={isDark ? 0.5 : 0.7} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 1 : 1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={isDark ? 0.3 : 0.4} />
      <pointLight position={[0, 5, 0]} intensity={isDark ? 0.5 : 0.6} />

      {showGrid && <SimpleGrid isDark={isDark} />}

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
        <span className="text-muted-foreground text-sm">Loading viewport...</span>
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full bg-background">
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
            isDark={isDark}
          />
        </Suspense>
      </Canvas>

      {/* Viewport overlay info */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground space-y-1">
        <p>LMB: Rotate • RMB: Pan • Scroll: Zoom</p>
        <p>Click part to select • Click empty to deselect</p>
      </div>
    </div>
  );
}