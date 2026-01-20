import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Gear component
export function Gear({ size = 1, teeth = 12, thickness = 0.3, color = '#4a9eff' }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size, size, thickness, teeth]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.3, size * 0.3, thickness * 1.1, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
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
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
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
      <mesh>
        <cylinderGeometry args={[radius, radius, width, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
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
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
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
  return (
    <group>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, (i / 7 - 0.5) * 1, 0]}>
          <torusGeometry args={[0.2, 0.03, 8, 16]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
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