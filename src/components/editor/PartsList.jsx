import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Trash2,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const PART_ICONS = {
  gear: Cog,
  shaft: Cylinder,
  bearing: CircleDot,
  pulley: Circle,
  belt: Link2,
  coupler: Grip,
  motor: Zap,
  piston: ArrowUpDown,
  spring: Waves,
  bracket: Wrench,
  plate: Square,
  bolt: Disc,
};

export default function PartsList({ 
  parts, 
  selectedPart, 
  onSelectPart, 
  onDeletePart,
  onDuplicatePart 
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
          Hierarchy
        </h2>
        <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
          {parts.length} parts
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {parts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Cog className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-sm text-white/40">No parts yet</p>
              <p className="text-xs text-white/20 mt-1">Click parts in the library to add them</p>
            </div>
          ) : (
            <div className="space-y-1">
              {parts.map((part, index) => {
                const Icon = PART_ICONS[part.type] || Cog;
                const isSelected = selectedPart === part.id;
                
                return (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <button
                      onClick={() => onSelectPart(part.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all",
                        "group",
                        isSelected 
                          ? "bg-cyan-500/20 border border-cyan-500/30" 
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                        isSelected 
                          ? "bg-cyan-500/30" 
                          : "bg-white/5 group-hover:bg-white/10"
                      )}>
                        <Icon className={cn(
                          "w-4 h-4",
                          isSelected ? "text-cyan-400" : "text-white/50"
                        )} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-white" : "text-white/70"
                        )}>
                          {part.name}
                        </p>
                        <p className="text-xs text-white/30">
                          {part.type}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicatePart(part.id);
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePart(part.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}