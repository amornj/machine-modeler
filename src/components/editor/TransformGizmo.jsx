import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Colors for XYZ axes
const AXIS_COLORS = {
  x: '#e00b0b', // Red
  y: '#0be044', // Green
  z: '#270be0', // Blue
};

// Scale Gizmo - 6 blue spheres on each side
function ScaleGizmo({ position, scale, onScale, onDragStart, onDragEnd }) {
  const { camera, gl } = useThree();
  const [activeHandle, setActiveHandle] = useState(null);
  const dragStart = useRef({ point: null, scale: null, axis: null, sign: null });

  const handleSize = 0.15;
  const handleDistance = 1.0;

  const handles = [
    { axis: 'x', sign: 1, pos: [handleDistance, 0, 0] },
    { axis: 'x', sign: -1, pos: [-handleDistance, 0, 0] },
    { axis: 'y', sign: 1, pos: [0, handleDistance, 0] },
    { axis: 'y', sign: -1, pos: [0, -handleDistance, 0] },
    { axis: 'z', sign: 1, pos: [0, 0, handleDistance] },
    { axis: 'z', sign: -1, pos: [0, 0, -handleDistance] },
  ];

  const handlePointerDown = (e, axis, sign) => {
    e.stopPropagation();
    setActiveHandle(`${axis}${sign}`);
    dragStart.current = {
      point: e.point.clone(),
      scale: { ...scale },
      axis,
      sign,
    };
    onDragStart?.();
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (!activeHandle || !dragStart.current.point) return;

    const { axis, sign, point: startPoint, scale: startScale } = dragStart.current;
    const delta = e.point.clone().sub(startPoint);

    // Calculate scale change based on axis
    let scaleDelta = 0;
    if (axis === 'x') scaleDelta = delta.x * sign;
    if (axis === 'y') scaleDelta = delta.y * sign;
    if (axis === 'z') scaleDelta = delta.z * sign;

    const newScale = {
      ...startScale,
      [axis]: Math.max(0.1, startScale[axis] + scaleDelta),
    };

    onScale(newScale);
  };

  const handlePointerUp = () => {
    if (activeHandle) {
      setActiveHandle(null);
      dragStart.current = { point: null, scale: null, axis: null, sign: null };
      onDragEnd?.();
      gl.domElement.style.cursor = 'auto';
    }
  };

  useEffect(() => {
    if (activeHandle) {
      window.addEventListener('pointerup', handlePointerUp);
      return () => window.removeEventListener('pointerup', handlePointerUp);
    }
  }, [activeHandle]);

  return (
    <group position={[position.x, position.y, position.z]}>
      {handles.map(({ axis, sign, pos }, index) => (
        <mesh
          key={index}
          position={pos}
          onPointerDown={(e) => handlePointerDown(e, axis, sign)}
          onPointerMove={activeHandle === `${axis}${sign}` ? handlePointerMove : undefined}
          onPointerOver={() => gl.domElement.style.cursor = 'grab'}
          onPointerOut={() => !activeHandle && (gl.domElement.style.cursor = 'auto')}
        >
          <sphereGeometry args={[handleSize, 16, 16]} />
          <meshStandardMaterial
            color={activeHandle === `${axis}${sign}` ? '#00ffff' : '#6678fa'}
            emissive={activeHandle === `${axis}${sign}` ? '#004444' : '#1a1f3d'}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Connecting lines to center */}
      {handles.map(({ pos }, index) => (
        <line key={`line-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, ...pos])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6678fa" opacity={0.5} transparent />
        </line>
      ))}
    </group>
  );
}

// Move Gizmo - XYZ arrows
function MoveGizmo({ position, onMove, onDragStart, onDragEnd }) {
  const { gl, camera, raycaster, pointer } = useThree();
  const [activeAxis, setActiveAxis] = useState(null);
  const dragStart = useRef({ point: null, position: null });
  const planeRef = useRef(new THREE.Plane());
  const intersectionPoint = useRef(new THREE.Vector3());

  const arrowLength = 1.2;
  const coneLength = 0.25;
  const shaftRadius = 0.03;
  const coneRadius = 0.08;

  const axes = [
    { axis: 'x', direction: [1, 0, 0], rotation: [0, 0, -Math.PI / 2], color: AXIS_COLORS.x },
    { axis: 'y', direction: [0, 1, 0], rotation: [0, 0, 0], color: AXIS_COLORS.y },
    { axis: 'z', direction: [0, 0, 1], rotation: [Math.PI / 2, 0, 0], color: AXIS_COLORS.z },
  ];

  const handlePointerDown = (e, axis, direction) => {
    e.stopPropagation();
    setActiveAxis(axis);

    // Create a plane perpendicular to the camera but containing the axis
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const axisVector = new THREE.Vector3(...direction);
    const planeNormal = new THREE.Vector3().crossVectors(axisVector, cameraDirection).cross(axisVector).normalize();

    planeRef.current.setFromNormalAndCoplanarPoint(
      planeNormal,
      new THREE.Vector3(position.x, position.y, position.z)
    );

    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(planeRef.current, intersectionPoint.current);

    dragStart.current = {
      point: intersectionPoint.current.clone(),
      position: { ...position },
    };
    onDragStart?.();
    gl.domElement.style.cursor = 'grabbing';
  };

  useFrame(() => {
    if (!activeAxis || !dragStart.current.point) return;

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(planeRef.current, intersectionPoint.current)) {
      const delta = intersectionPoint.current.clone().sub(dragStart.current.point);
      const startPos = dragStart.current.position;

      // Only move along the active axis
      const newPosition = { ...startPos };
      newPosition[activeAxis] = startPos[activeAxis] + delta[activeAxis];

      onMove(newPosition);
    }
  });

  const handlePointerUp = () => {
    if (activeAxis) {
      setActiveAxis(null);
      dragStart.current = { point: null, position: null };
      onDragEnd?.();
      gl.domElement.style.cursor = 'auto';
    }
  };

  useEffect(() => {
    if (activeAxis) {
      window.addEventListener('pointerup', handlePointerUp);
      return () => window.removeEventListener('pointerup', handlePointerUp);
    }
  }, [activeAxis]);

  return (
    <group position={[position.x, position.y, position.z]}>
      {axes.map(({ axis, direction, rotation, color }) => (
        <group key={axis} rotation={rotation}>
          {/* Arrow shaft */}
          <mesh
            position={[0, arrowLength / 2, 0]}
            onPointerDown={(e) => handlePointerDown(e, axis, direction)}
            onPointerOver={() => gl.domElement.style.cursor = 'grab'}
            onPointerOut={() => !activeAxis && (gl.domElement.style.cursor = 'auto')}
          >
            <cylinderGeometry args={[shaftRadius, shaftRadius, arrowLength, 8]} />
            <meshStandardMaterial
              color={activeAxis === axis ? '#ffffff' : color}
              emissive={activeAxis === axis ? color : '#000000'}
              emissiveIntensity={activeAxis === axis ? 0.5 : 0}
            />
          </mesh>
          {/* Arrow head */}
          <mesh
            position={[0, arrowLength + coneLength / 2, 0]}
            onPointerDown={(e) => handlePointerDown(e, axis, direction)}
            onPointerOver={() => gl.domElement.style.cursor = 'grab'}
            onPointerOut={() => !activeAxis && (gl.domElement.style.cursor = 'auto')}
          >
            <coneGeometry args={[coneRadius, coneLength, 16]} />
            <meshStandardMaterial
              color={activeAxis === axis ? '#ffffff' : color}
              emissive={activeAxis === axis ? color : '#000000'}
              emissiveIntensity={activeAxis === axis ? 0.5 : 0}
            />
          </mesh>
        </group>
      ))}
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  );
}

// Rotation Gizmo - 6 spheres with circular rings
function RotationGizmo({ position, rotation, onRotate, onDragStart, onDragEnd }) {
  const { gl, camera, raycaster, pointer } = useThree();
  const [activeAxis, setActiveAxis] = useState(null);
  const dragStart = useRef({ angle: null, rotation: null });
  const ringRadius = 1.2;
  const sphereSize = 0.12;

  // Create ring geometry for each axis
  const createRingPoints = (axis, segments = 64) => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      if (axis === 'x') {
        points.push(new THREE.Vector3(0, Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius));
      } else if (axis === 'y') {
        points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius));
      } else {
        points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0));
      }
    }
    return points;
  };

  // Sphere positions on each ring (at 0, 180 degrees)
  const spherePositions = useMemo(() => [
    // X-axis ring (red) - spheres at front and back
    { axis: 'x', color: AXIS_COLORS.x, positions: [
      [0, 0, ringRadius],
      [0, 0, -ringRadius],
    ]},
    // Y-axis ring (green) - spheres at left and right
    { axis: 'y', color: AXIS_COLORS.y, positions: [
      [ringRadius, 0, 0],
      [-ringRadius, 0, 0],
    ]},
    // Z-axis ring (blue) - spheres at top and bottom
    { axis: 'z', color: AXIS_COLORS.z, positions: [
      [0, ringRadius, 0],
      [0, -ringRadius, 0],
    ]},
  ], [ringRadius]);

  const getAngleFromPointer = (axis) => {
    const gizmoPos = new THREE.Vector3(position.x, position.y, position.z);

    // Create plane for the rotation axis
    let planeNormal;
    if (axis === 'x') planeNormal = new THREE.Vector3(1, 0, 0);
    else if (axis === 'y') planeNormal = new THREE.Vector3(0, 1, 0);
    else planeNormal = new THREE.Vector3(0, 0, 1);

    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, gizmoPos);

    raycaster.setFromCamera(pointer, camera);
    const intersectionPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
      const local = intersectionPoint.sub(gizmoPos);

      if (axis === 'x') return Math.atan2(local.y, local.z);
      if (axis === 'y') return Math.atan2(local.x, local.z);
      return Math.atan2(local.y, local.x);
    }
    return 0;
  };

  const handlePointerDown = (e, axis) => {
    e.stopPropagation();
    setActiveAxis(axis);

    const currentAngle = getAngleFromPointer(axis);
    dragStart.current = {
      angle: currentAngle,
      rotation: { ...rotation },
    };
    onDragStart?.();
    gl.domElement.style.cursor = 'grabbing';
  };

  useFrame(() => {
    if (!activeAxis || dragStart.current.angle === null) return;

    const currentAngle = getAngleFromPointer(activeAxis);
    const deltaAngle = currentAngle - dragStart.current.angle;
    const startRot = dragStart.current.rotation;

    const newRotation = { ...startRot };
    newRotation[activeAxis] = startRot[activeAxis] + deltaAngle;

    onRotate(newRotation);
  });

  const handlePointerUp = () => {
    if (activeAxis) {
      setActiveAxis(null);
      dragStart.current = { angle: null, rotation: null };
      onDragEnd?.();
      gl.domElement.style.cursor = 'auto';
    }
  };

  useEffect(() => {
    if (activeAxis) {
      window.addEventListener('pointerup', handlePointerUp);
      return () => window.removeEventListener('pointerup', handlePointerUp);
    }
  }, [activeAxis]);

  // Create ring line geometry
  const RingLine = ({ axis, color }) => {
    const points = createRingPoints(axis);
    const geometry = useMemo(() => {
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return geo;
    }, [points]);

    return (
      <line geometry={geometry}>
        <lineBasicMaterial
          color={activeAxis === axis ? '#ffffff' : color}
          linewidth={2}
          opacity={activeAxis === axis ? 1 : 0.8}
          transparent
        />
      </line>
    );
  };

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Rings */}
      <RingLine axis="x" color={AXIS_COLORS.x} />
      <RingLine axis="y" color={AXIS_COLORS.y} />
      <RingLine axis="z" color={AXIS_COLORS.z} />

      {/* Spheres on rings */}
      {spherePositions.map(({ axis, color, positions }) =>
        positions.map((pos, index) => (
          <mesh
            key={`${axis}-${index}`}
            position={pos}
            onPointerDown={(e) => handlePointerDown(e, axis)}
            onPointerOver={() => gl.domElement.style.cursor = 'grab'}
            onPointerOut={() => !activeAxis && (gl.domElement.style.cursor = 'auto')}
          >
            <sphereGeometry args={[sphereSize, 16, 16]} />
            <meshStandardMaterial
              color={activeAxis === axis ? '#ffffff' : color}
              emissive={activeAxis === axis ? color : '#000000'}
              emissiveIntensity={activeAxis === axis ? 0.5 : 0}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

// Main TransformGizmo component
export default function TransformGizmo({
  part,
  activeTool,
  onUpdatePart,
  onDragStart,
  onDragEnd
}) {
  if (!part || activeTool === 'select') return null;

  const handleScale = (newScale) => {
    onUpdatePart(part.id, { scale: newScale });
  };

  const handleMove = (newPosition) => {
    onUpdatePart(part.id, { position: newPosition });
  };

  const handleRotate = (newRotation) => {
    onUpdatePart(part.id, { rotation: newRotation });
  };

  return (
    <>
      {activeTool === 'scale' && (
        <ScaleGizmo
          position={part.position}
          scale={part.scale}
          onScale={handleScale}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )}
      {activeTool === 'translate' && (
        <MoveGizmo
          position={part.position}
          onMove={handleMove}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )}
      {activeTool === 'rotate' && (
        <RotationGizmo
          position={part.position}
          rotation={part.rotation}
          onRotate={handleRotate}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )}
    </>
  );
}
