import React, { useRef } from 'react';
import * as THREE from 'three';

// Gear component
export function Gear({ size = 1, teeth = 12, thickness = 0.3, color = '#4a9eff' }) {
  const shape = new THREE.Shape();
  const outerRadius = size;
  const innerRadius = size * 0.7;
  const toothHeight = size * 0.15;
  
  for (let i = 0; i < teeth; i++) {
    const angle1 = (i / teeth) * Math.PI * 2;
    const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;
    
    if (i === 0) {
      shape.moveTo(Math.cos(angle1) * outerRadius, Math.sin(angle1) * outerRadius);
    }
    shape.lineTo(Math.cos(angle2) * (outerRadius + toothHeight), Math.sin(angle2) * (outerRadius + toothHeight));
    shape.lineTo(Math.cos(angle3) * (outerRadius + toothHeight), Math.sin(angle3) * (outerRadius + toothHeight));
    shape.lineTo(Math.cos(angle4) * outerRadius, Math.sin(angle4) * outerRadius);
  }
  shape.closePath();
  
  const holeShape = new THREE.Shape();
  holeShape.absarc(0, 0, size * 0.15, 0, Math.PI * 2, false);
  shape.holes.push(holeShape);
  
  const extrudeSettings = { depth: thickness, bevelEnabled: false };
  
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -thickness / 2, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

// Shaft/Cylinder component
export function Shaft({ length = 2, radius = 0.1, color = '#888888' }) {
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[radius, radius, length, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Bearing component
export function Bearing({ outerRadius = 0.4, innerRadius = 0.15, width = 0.2, color = '#666666' }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[(outerRadius + innerRadius) / 2, (outerRadius - innerRadius) / 2, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Motor component
export function Motor({ color = '#2a2a3e' }) {
  return (
    <group>
      {/* Motor body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Motor shaft */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Motor base */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Pulley component
export function Pulley({ radius = 0.4, width = 0.2, color = '#4a9eff' }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Main wheel */}
      <mesh>
        <cylinderGeometry args={[radius, radius, width, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Groove */}
      <mesh>
        <torusGeometry args={[radius, width * 0.3, 8, 32]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Belt component
export function Belt({ color = '#1a1a1a' }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.05, 8, 64]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

// Piston component
export function Piston({ color = '#666666' }) {
  return (
    <group>
      {/* Cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Rod */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Bracket component
export function Bracket({ color = '#444455' }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.35, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.35, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Spring component
export function Spring({ color = '#00d9ff' }) {
  const points = [];
  const coils = 8;
  const height = 1;
  const radius = 0.2;
  
  for (let i = 0; i <= coils * 32; i++) {
    const t = i / (coils * 32);
    const angle = t * coils * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      t * height - height / 2,
      Math.sin(angle) * radius
    ));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 128, 0.03, 8, false]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

// Connector/Bolt component
export function Bolt({ color = '#888888' }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 6]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Plate component
export function Plate({ color = '#3a3a4e' }) {
  return (
    <mesh>
      <boxGeometry args={[1.5, 0.1, 1]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
    </mesh>
  );
}

// Coupler component
export function Coupler({ color = '#555566' }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Part wrapper that renders the correct mesh based on type
export function PartMesh({ type, isSelected }) {
  const meshRef = useRef();
  
  const renderPart = () => {
    switch (type) {
      case 'gear': return <Gear />;
      case 'shaft': return <Shaft />;
      case 'bearing': return <Bearing />;
      case 'motor': return <Motor />;
      case 'pulley': return <Pulley />;
      case 'belt': return <Belt />;
      case 'piston': return <Piston />;
      case 'bracket': return <Bracket />;
      case 'spring': return <Spring />;
      case 'bolt': return <Bolt />;
      case 'plate': return <Plate />;
      case 'coupler': return <Coupler />;
      default: return <Gear />;
    }
  };
  
  return (
    <group ref={meshRef}>
      {renderPart()}
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial color="#00d9ff" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

export default PartMesh;