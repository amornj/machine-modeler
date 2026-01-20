import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export default function PropertiesPanel({ selectedPart, parts, onUpdatePart }) {
  const part = parts.find(p => p.id === selectedPart);
  
  if (!part) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
            Properties
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-white/40 text-center">
            Select a part to view properties
          </p>
        </div>
      </div>
    );
  }
  
  const handlePositionChange = (axis, value) => {
    onUpdatePart(part.id, {
      position: { ...part.position, [axis]: parseFloat(value) || 0 }
    });
  };
  
  const handleRotationChange = (axis, value) => {
    onUpdatePart(part.id, {
      rotation: { ...part.rotation, [axis]: parseFloat(value) || 0 }
    });
  };
  
  const handleScaleChange = (axis, value) => {
    onUpdatePart(part.id, {
      scale: { ...part.scale, [axis]: parseFloat(value) || 1 }
    });
  };
  
  const handleNameChange = (name) => {
    onUpdatePart(part.id, { name });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
          Properties
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label className="text-xs text-white/50">Name</Label>
          <Input
            value={part.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="bg-white/5 border-white/10 text-white h-9"
          />
        </div>
        
        {/* Position */}
        <div className="space-y-3">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Position</Label>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map(axis => (
              <div key={axis} className="space-y-1">
                <Label className={cn(
                  "text-xs font-medium",
                  axis === 'x' ? "text-red-400" : axis === 'y' ? "text-green-400" : "text-blue-400"
                )}>
                  {axis.toUpperCase()}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={part.position[axis]}
                  onChange={(e) => handlePositionChange(axis, e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Rotation */}
        <div className="space-y-3">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Rotation (degrees)</Label>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map(axis => (
              <div key={axis} className="space-y-1">
                <Label className={cn(
                  "text-xs font-medium",
                  axis === 'x' ? "text-red-400" : axis === 'y' ? "text-green-400" : "text-blue-400"
                )}>
                  {axis.toUpperCase()}
                </Label>
                <Input
                  type="number"
                  step="15"
                  value={Math.round(part.rotation[axis] * (180 / Math.PI))}
                  onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value) * (Math.PI / 180))}
                  className="bg-white/5 border-white/10 text-white h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Scale */}
        <div className="space-y-3">
          <Label className="text-xs text-white/50 uppercase tracking-wider">Scale</Label>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map(axis => (
              <div key={axis} className="space-y-1">
                <Label className={cn(
                  "text-xs font-medium",
                  axis === 'x' ? "text-red-400" : axis === 'y' ? "text-green-400" : "text-blue-400"
                )}>
                  {axis.toUpperCase()}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={part.scale[axis]}
                  onChange={(e) => handleScaleChange(axis, e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Part Info */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Type</span>
            <span className="text-white/70 capitalize">{part.type}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-white/40">ID</span>
            <span className="text-white/50 font-mono text-[10px]">{part.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}