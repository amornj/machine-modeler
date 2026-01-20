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
  Grip
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PARTS = [
  { id: 'gear', name: 'Gear', icon: Cog, category: 'Transmission' },
  { id: 'shaft', name: 'Shaft', icon: Cylinder, category: 'Transmission' },
  { id: 'bearing', name: 'Bearing', icon: CircleDot, category: 'Transmission' },
  { id: 'pulley', name: 'Pulley', icon: Circle, category: 'Transmission' },
  { id: 'belt', name: 'Belt', icon: Link2, category: 'Transmission' },
  { id: 'coupler', name: 'Coupler', icon: Grip, category: 'Transmission' },
  { id: 'motor', name: 'Motor', icon: Zap, category: 'Power' },
  { id: 'piston', name: 'Piston', icon: ArrowUpDown, category: 'Power' },
  { id: 'spring', name: 'Spring', icon: Waves, category: 'Mechanical' },
  { id: 'bracket', name: 'Bracket', icon: Wrench, category: 'Structure' },
  { id: 'plate', name: 'Plate', icon: Square, category: 'Structure' },
  { id: 'bolt', name: 'Bolt', icon: Disc, category: 'Fasteners' },
];

const CATEGORIES = ['Transmission', 'Power', 'Mechanical', 'Structure', 'Fasteners'];

export default function PartsLibrary({ onAddPart }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
          Parts Library
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CATEGORIES.map(category => {
          const categoryParts = PARTS.filter(p => p.category === category);
          if (categoryParts.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-1">
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
                      "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30",
                      "transition-all duration-200 group"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                      <part.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-xs font-medium text-white/70 group-hover:text-white/90">
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