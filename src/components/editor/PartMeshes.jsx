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

// ========== NEW TRANSMISSION PARTS ==========

// Bevel Gear component - angled gear for perpendicular shafts
export function BevelGear({ color = '#4a9eff' }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.6, 0.4, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, -0.1, 0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Worm Gear component - spiral gear
export function WormGear({ color = '#4a9eff' }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[(i / 9 - 0.5) * 1, 0, 0]} rotation={[0, 0, Math.PI / 2 + i * 0.3]}>
          <torusGeometry args={[0.2, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Gear Rack component - linear gear
export function Rack({ color = '#4a9eff' }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2, 0.15, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[(i / 11 - 0.5) * 1.8, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.25]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Sprocket component - chain gear
export function Sprocket({ color = '#555566' }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.55, 0, Math.sin(angle) * 0.55]}>
            <boxGeometry args={[0.08, 0.12, 0.15]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Chain component
export function Chain({ color = '#333333' }) {
  return (
    <group>
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0]} rotation={[0, 0, angle]}>
            <torusGeometry args={[0.06, 0.02, 6, 8]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// Flywheel component - heavy rotating mass
export function Flywheel({ color = '#3a3a4e' }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.6, 0.6, 0.25, 32]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Cam component - eccentric rotating element
export function Cam({ color = '#4a9eff' }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ========== NEW POWER PARTS ==========

// Servo Motor component
export function ServoMotor({ color = '#1a3a5e' }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[0.35, 0.1, 0.45]} />
        <meshStandardMaterial color="#222233" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Stepper Motor component
export function StepperMotor({ color = '#2a2a3e' }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.6, 32]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.1, 32]} />
        <meshStandardMaterial color="#333344" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Wiring connector */}
      <mesh position={[0.2, 0, 0.2]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.1, 0.08]} />
        <meshStandardMaterial color="#444455" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Pneumatic Cylinder component
export function PneumaticCylinder({ color = '#4477aa' }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Air fitting */}
      <mesh position={[0.22, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
        <meshStandardMaterial color="#666677" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Hydraulic Cylinder component
export function HydraulicCylinder({ color = '#aa5533' }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Hydraulic fittings */}
      <mesh position={[0.27, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#555566" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.27, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#555566" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ========== NEW MECHANICAL PARTS ==========

// Damper component
export function Damper({ color = '#444455' }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.6, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 32]} />
        <meshStandardMaterial color="#666677" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Crankshaft component
export function Crankshaft({ color = '#555566' }) {
  return (
    <group>
      {/* Main shaft sections */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Crank throws */}
      <mesh position={[-0.3, 0.2, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.3, -0.2, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Crank pins */}
      <mesh position={[-0.3, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.3, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Center section */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ========== NEW STRUCTURE PARTS ==========

// I-Beam component
export function Beam({ color = '#3a3a4e' }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2, 0.08, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2, 0.08, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh>
        <boxGeometry args={[2, 0.35, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Frame component - rectangular frame
export function Frame({ color = '#3a3a4e' }) {
  return (
    <group>
      {/* Four corner posts */}
      <mesh position={[-0.5, 0, -0.5]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.5, 0, -0.5]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.5, 0, 0.5]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.5, 0, 0.5]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Top cross beams */}
      <mesh position={[0, 0.45, -0.5]}>
        <boxGeometry args={[1, 0.1, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.45, 0.5]}>
        <boxGeometry args={[1, 0.1, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.5, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.5, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Enclosure component - box housing
export function Enclosure({ color = '#2a2a3e' }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.8, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} transparent opacity={0.9} />
      </mesh>
      {/* Lid line */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.02, 0.02, 0.62]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Ventilation slots */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[0.52, (i / 3 - 0.5) * 0.5, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.4]} />
          <meshStandardMaterial color="#111122" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ========== NEW FASTENER PARTS ==========

// Nut component
export function Nut({ color = '#888888' }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 6]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Washer component
export function Washer({ color = '#777777' }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.1, 0.04, 8, 24]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Screw component
export function Screw({ color = '#888888' }) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cross slot */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.12]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Rivet component
export function Rivet({ color = '#999999' }) {
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ========== ROBOTICS PARTS ==========

// Arm Segment component - robotic arm link
export function ArmSegment({ color = '#2a4a6e' }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* End caps/joints */}
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#3a5a7e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#3a5a7e" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Robotic Joint component - articulated joint
export function RoboticJoint({ color = '#3a5a7e' }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <meshStandardMaterial color="#2a4a6e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Joint ring detail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.03, 8, 32]} />
        <meshStandardMaterial color="#1a3a5e" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Gripper component - robotic claw/gripper
export function Gripper({ color = '#3a5a7e' }) {
  return (
    <group>
      {/* Base */}
      <mesh>
        <boxGeometry args={[0.4, 0.15, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Left finger */}
      <mesh position={[-0.15, -0.25, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.08, 0.35, 0.15]} />
        <meshStandardMaterial color="#2a4a6e" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.22, -0.45, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.06, 0.2, 0.12]} />
        <meshStandardMaterial color="#1a3a5e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right finger */}
      <mesh position={[0.15, -0.25, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.08, 0.35, 0.15]} />
        <meshStandardMaterial color="#2a4a6e" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.22, -0.45, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.2, 0.12]} />
        <meshStandardMaterial color="#1a3a5e" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// End Effector component - tool mount
export function EndEffector({ color = '#4a6a8e' }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.25, 32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 6]} />
        <meshStandardMaterial color="#2a4a6e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tool mount plate */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
        <meshStandardMaterial color="#1a3a5e" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Robot Base component - mounting platform
export function RobotBase({ color = '#2a3a4e' }) {
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.2, 32]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
        <meshStandardMaterial color="#3a4a5e" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#4a5a6e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Mounting holes */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.5, -0.1, Math.sin(angle) * 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 8]} />
            <meshStandardMaterial color="#111122" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// ========== LINEAR MOTION PARTS ==========

// Linear Actuator component
export function LinearActuator({ color = '#3a4a5e' }) {
  return (
    <group>
      {/* Motor housing */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.35]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Cylinder body */}
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color="#4a5a6e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Extended rod */}
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* End mount */}
      <mesh position={[1.1, 0, 0]}>
        <boxGeometry args={[0.1, 0.2, 0.2]} />
        <meshStandardMaterial color="#333344" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Linear Rail component
export function LinearRail({ color = '#4a4a5e' }) {
  return (
    <group>
      {/* Rail base */}
      <mesh>
        <boxGeometry args={[2, 0.1, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Rail profile */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[2, 0.06, 0.15]} />
        <meshStandardMaterial color="#5a5a6e" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Mounting holes */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i / 4 - 0.5) * 1.8, 0, 0.1]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <meshStandardMaterial color="#222233" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Lead Screw component
export function LeadScrew({ color = '#666677' }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Thread representation */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[(i / 19 - 0.5) * 1.9, 0, 0]} rotation={[0, i * 0.3, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.015, 6, 16, Math.PI]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* End bearings */}
      <mesh position={[-1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#444455" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#444455" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Slider Block component
export function Slider({ color = '#5a5a6e' }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.4, 0.25, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Rail groove */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.42, 0.08, 0.2]} />
        <meshStandardMaterial color="#3a3a4e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Mounting holes */}
      <mesh position={[-0.12, 0.13, -0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        <meshStandardMaterial color="#222233" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.13, -0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        <meshStandardMaterial color="#222233" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.12, 0.13, 0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        <meshStandardMaterial color="#222233" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.13, 0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        <meshStandardMaterial color="#222233" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ========== LINKAGE PARTS ==========

// Connecting Rod component
export function ConnectingRod({ color = '#555566' }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Big end */}
      <mesh position={[-0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.05, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Small end */}
      <mesh position={[0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.04, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Lever component
export function Lever({ color = '#444455' }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1, 0.1, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Pivot point */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.4, 0.4, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#222233" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Rocker Arm component
export function RockerArm({ color = '#555566' }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 0.12, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Center pivot */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* End rollers */}
      <mesh position={[-0.45, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.22, 12]} />
        <meshStandardMaterial color="#444455" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.45, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.22, 12]} />
        <meshStandardMaterial color="#444455" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Linkage Bar component
export function LinkageBar({ color = '#555566' }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* End holes */}
      <mesh position={[-0.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.025, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.025, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Ball Joint component
export function BallJoint({ color = '#444455' }) {
  return (
    <group>
      {/* Socket housing */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Ball */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#666677" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Stud */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.25, 16]} />
        <meshStandardMaterial color="#777788" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Boot */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#222233" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Universal Joint (U-Joint) component
export function UniversalJoint({ color = '#555566' }) {
  return (
    <group>
      {/* Center cross */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#777788" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#777788" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Yokes */}
      <mesh position={[-0.2, 0, 0]}>
        <torusGeometry args={[0.12, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, Math.PI, 0]}>
        <torusGeometry args={[0.12, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Shaft stubs */}
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Hinge component
export function Hinge({ color = '#666677' }) {
  return (
    <group>
      {/* Hinge leaves */}
      <mesh position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.05]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.05]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Knuckles */}
      {[-0.15, 0, 0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
          <meshStandardMaterial color="#555566" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Pin */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
        <meshStandardMaterial color="#888899" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Part wrapper that renders the correct mesh based on type
export function PartMesh({ type, isSelected }) {
  const meshRef = useRef();
  
  const renderPart = () => {
    switch (type) {
      // Transmission parts
      case 'gear': return <Gear />;
      case 'bevel-gear': return <BevelGear />;
      case 'worm-gear': return <WormGear />;
      case 'rack': return <Rack />;
      case 'sprocket': return <Sprocket />;
      case 'shaft': return <Shaft />;
      case 'bearing': return <Bearing />;
      case 'pulley': return <Pulley />;
      case 'belt': return <Belt />;
      case 'chain': return <Chain />;
      case 'coupler': return <Coupler />;
      case 'flywheel': return <Flywheel />;
      case 'cam': return <Cam />;

      // Power parts
      case 'motor': return <Motor />;
      case 'servo-motor': return <ServoMotor />;
      case 'stepper-motor': return <StepperMotor />;
      case 'piston': return <Piston />;
      case 'pneumatic-cylinder': return <PneumaticCylinder />;
      case 'hydraulic-cylinder': return <HydraulicCylinder />;

      // Mechanical parts
      case 'spring': return <Spring />;
      case 'damper': return <Damper />;
      case 'crankshaft': return <Crankshaft />;

      // Structure parts
      case 'bracket': return <Bracket />;
      case 'plate': return <Plate />;
      case 'beam': return <Beam />;
      case 'frame': return <Frame />;
      case 'enclosure': return <Enclosure />;

      // Fastener parts
      case 'bolt': return <Bolt />;
      case 'nut': return <Nut />;
      case 'washer': return <Washer />;
      case 'screw': return <Screw />;
      case 'rivet': return <Rivet />;

      // Robotics parts
      case 'arm-segment': return <ArmSegment />;
      case 'robotic-joint': return <RoboticJoint />;
      case 'gripper': return <Gripper />;
      case 'end-effector': return <EndEffector />;
      case 'robot-base': return <RobotBase />;

      // Linear motion parts
      case 'linear-actuator': return <LinearActuator />;
      case 'linear-rail': return <LinearRail />;
      case 'lead-screw': return <LeadScrew />;
      case 'slider': return <Slider />;

      // Linkage parts
      case 'connecting-rod': return <ConnectingRod />;
      case 'lever': return <Lever />;
      case 'rocker-arm': return <RockerArm />;
      case 'linkage-bar': return <LinkageBar />;
      case 'ball-joint': return <BallJoint />;
      case 'universal-joint': return <UniversalJoint />;
      case 'hinge': return <Hinge />;

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