import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DraggableNumberInput from '@/components/ui/DraggableNumberInput';

export default function PropertiesPanel({ selectedPart, parts, onUpdatePart }) {
  const part = parts.find(p => p.id === selectedPart);

  if (!part) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">
            Properties
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Select a part to view properties
          </p>
        </div>
      </div>
    );
  }

  const handlePositionChange = (axis, value) => {
    onUpdatePart(part.id, {
      position: { ...part.position, [axis]: value }
    });
  };

  const handleRotationChange = (axis, value) => {
    onUpdatePart(part.id, {
      rotation: { ...part.rotation, [axis]: value }
    });
  };

  const handleScaleChange = (axis, value) => {
    onUpdatePart(part.id, {
      scale: { ...part.scale, [axis]: value }
    });
  };

  const handleNameChange = (name) => {
    onUpdatePart(part.id, { name });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">
          Properties
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <Input
            value={part.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-muted border-border text-foreground h-9"
          />
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Position</Label>
          <div className="space-y-1">
            {['x', 'y', 'z'].map(axis => (
              <DraggableNumberInput
                key={axis}
                label={axis.toUpperCase()}
                value={part.position[axis]}
                onChange={(val) => handlePositionChange(axis, val)}
                step={0.1}
                sensitivity={0.05}
                labelColor={
                  axis === 'x' ? "text-red-500" : axis === 'y' ? "text-green-500" : "text-blue-500"
                }
              />
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Rotation (degrees)</Label>
          <div className="space-y-1">
            {['x', 'y', 'z'].map(axis => (
              <DraggableNumberInput
                key={axis}
                label={axis.toUpperCase()}
                value={Math.round(part.rotation[axis] * (180 / Math.PI))}
                onChange={(val) => handleRotationChange(axis, val * (Math.PI / 180))}
                step={5}
                sensitivity={0.5}
                labelColor={
                  axis === 'x' ? "text-red-500" : axis === 'y' ? "text-green-500" : "text-blue-500"
                }
              />
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Scale</Label>
          <div className="space-y-1">
            {['x', 'y', 'z'].map(axis => (
              <DraggableNumberInput
                key={axis}
                label={axis.toUpperCase()}
                value={part.scale[axis]}
                onChange={(val) => handleScaleChange(axis, val)}
                step={0.1}
                min={0.1}
                sensitivity={0.02}
                labelColor={
                  axis === 'x' ? "text-red-500" : axis === 'y' ? "text-green-500" : "text-blue-500"
                }
              />
            ))}
          </div>
        </div>

        {/* Part Info */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Type</span>
            <span className="text-foreground/70 capitalize">{part.type}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-muted-foreground">ID</span>
            <span className="text-muted-foreground font-mono text-[10px]">{part.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}