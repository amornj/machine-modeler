import React from 'react';
import { motion } from 'framer-motion';
import {
  Cog,
  CircleDot,
  Cylinder,
  Zap,
  Circle,
  Link2,
  ArrowUpDown,
  Wrench,
  Waves,
  Disc,
  Square,
  Grip,
  Settings,
  CircleDashed,
  RotateCcw,
  Gauge,
  Radio,
  Cpu,
  Wind,
  Droplets,
  Activity,
  Box,
  Boxes,
  Package,
  Hexagon,
  CircleOff,
  Hash,
  Target,
  Hand,
  Move,
  ArrowRight,
  GitBranch,
  Minus,
  CornerDownRight,
  Anchor,
  Navigation,
  Rotate3D,
  PanelTop,
  GripVertical,
  Scissors,
  MoveHorizontal,
  Ruler,
  SlidersHorizontal,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PARTS = [
  // Transmission - Gears & Rotary
  { id: 'gear', name: 'Spur Gear', icon: Cog, category: 'Transmission' },
  { id: 'bevel-gear', name: 'Bevel Gear', icon: Settings, category: 'Transmission' },
  { id: 'worm-gear', name: 'Worm Gear', icon: CircleDashed, category: 'Transmission' },
  { id: 'rack', name: 'Gear Rack', icon: GripVertical, category: 'Transmission' },
  { id: 'sprocket', name: 'Sprocket', icon: CircleDot, category: 'Transmission' },
  { id: 'shaft', name: 'Shaft', icon: Cylinder, category: 'Transmission' },
  { id: 'bearing', name: 'Bearing', icon: RotateCcw, category: 'Transmission' },
  { id: 'pulley', name: 'Pulley', icon: Circle, category: 'Transmission' },
  { id: 'belt', name: 'Belt', icon: Link2, category: 'Transmission' },
  { id: 'chain', name: 'Chain', icon: Link2, category: 'Transmission' },
  { id: 'coupler', name: 'Coupler', icon: Grip, category: 'Transmission' },
  { id: 'flywheel', name: 'Flywheel', icon: Gauge, category: 'Transmission' },
  { id: 'cam', name: 'Cam', icon: CircleOff, category: 'Transmission' },

  // Power - Motors & Actuators
  { id: 'motor', name: 'DC Motor', icon: Zap, category: 'Power' },
  { id: 'servo-motor', name: 'Servo Motor', icon: Radio, category: 'Power' },
  { id: 'stepper-motor', name: 'Stepper Motor', icon: Cpu, category: 'Power' },
  { id: 'piston', name: 'Piston', icon: ArrowUpDown, category: 'Power' },
  { id: 'pneumatic-cylinder', name: 'Pneumatic Cyl', icon: Wind, category: 'Power' },
  { id: 'hydraulic-cylinder', name: 'Hydraulic Cyl', icon: Droplets, category: 'Power' },

  // Mechanical - Springs & Dampers
  { id: 'spring', name: 'Spring', icon: Waves, category: 'Mechanical' },
  { id: 'damper', name: 'Damper', icon: Activity, category: 'Mechanical' },
  { id: 'crankshaft', name: 'Crankshaft', icon: GitBranch, category: 'Mechanical' },

  // Structure - Frames & Mounting
  { id: 'bracket', name: 'Bracket', icon: Wrench, category: 'Structure' },
  { id: 'plate', name: 'Plate', icon: Square, category: 'Structure' },
  { id: 'beam', name: 'I-Beam', icon: Minus, category: 'Structure' },
  { id: 'frame', name: 'Frame', icon: Box, category: 'Structure' },
  { id: 'enclosure', name: 'Enclosure', icon: Package, category: 'Structure' },

  // Fasteners
  { id: 'bolt', name: 'Bolt', icon: Disc, category: 'Fasteners' },
  { id: 'nut', name: 'Nut', icon: Hexagon, category: 'Fasteners' },
  { id: 'washer', name: 'Washer', icon: CircleDashed, category: 'Fasteners' },
  { id: 'screw', name: 'Screw', icon: Hash, category: 'Fasteners' },
  { id: 'rivet', name: 'Rivet', icon: Target, category: 'Fasteners' },

  // Robotics - Arms & Joints
  { id: 'arm-segment', name: 'Arm Segment', icon: Move, category: 'Robotics' },
  { id: 'robotic-joint', name: 'Robotic Joint', icon: Rotate3D, category: 'Robotics' },
  { id: 'gripper', name: 'Gripper', icon: Hand, category: 'Robotics' },
  { id: 'end-effector', name: 'End Effector', icon: Scissors, category: 'Robotics' },
  { id: 'robot-base', name: 'Robot Base', icon: PanelTop, category: 'Robotics' },

  // Linear Motion
  { id: 'linear-actuator', name: 'Linear Actuator', icon: ArrowRight, category: 'Linear Motion' },
  { id: 'linear-rail', name: 'Linear Rail', icon: MoveHorizontal, category: 'Linear Motion' },
  { id: 'lead-screw', name: 'Lead Screw', icon: Ruler, category: 'Linear Motion' },
  { id: 'slider', name: 'Slider Block', icon: SlidersHorizontal, category: 'Linear Motion' },

  // Linkages - Mechanical Connections
  { id: 'connecting-rod', name: 'Connecting Rod', icon: Minus, category: 'Linkages' },
  { id: 'lever', name: 'Lever', icon: CornerDownRight, category: 'Linkages' },
  { id: 'rocker-arm', name: 'Rocker Arm', icon: ArrowLeftRight, category: 'Linkages' },
  { id: 'linkage-bar', name: 'Linkage Bar', icon: Minus, category: 'Linkages' },
  { id: 'ball-joint', name: 'Ball Joint', icon: CircleDot, category: 'Linkages' },
  { id: 'universal-joint', name: 'U-Joint', icon: Navigation, category: 'Linkages' },
  { id: 'hinge', name: 'Hinge', icon: Anchor, category: 'Linkages' },
];

const CATEGORIES = ['Transmission', 'Power', 'Mechanical', 'Structure', 'Fasteners', 'Robotics', 'Linear Motion', 'Linkages'];

export default function PartsLibrary({ onAddPart }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">
          Parts Library
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CATEGORIES.map(category => {
          const categoryParts = PARTS.filter(p => p.category === category);
          if (categoryParts.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categoryParts.map(part => (
                  <motion.button
                    key={part.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddPart(part.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl",
                      "bg-muted/50 hover:bg-muted border border-border hover:border-cyan-500/30",
                      "transition-all duration-200 group"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                      <part.icon className="w-5 h-5 text-cyan-500" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                      {part.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}