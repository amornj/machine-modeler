import React from 'react';
import { motion } from 'framer-motion';
import { 
  Move, 
  RotateCcw, 
  Maximize2, 
  MousePointer2,
  Grid3X3,
  Magnet,
  Undo,
  Redo,
  Save,
  FolderOpen,
  Plus,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TRANSFORM_TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'translate', icon: Move, label: 'Move (G)' },
  { id: 'rotate', icon: RotateCcw, label: 'Rotate (R)' },
  { id: 'scale', icon: Maximize2, label: 'Scale (S)' },
];

export default function Toolbar({ 
  activeTool, 
  onToolChange, 
  showGrid, 
  onToggleGrid,
  snapEnabled,
  onToggleSnap,
  onSave,
  onLoad,
  onNew,
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2 p-2 bg-[#0d0d14]/90 backdrop-blur-xl border-b border-white/5">
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onNew}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Project</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onLoad}
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open Project</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onSave}
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save Project</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onExport}
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-white/10" />
        
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9",
                  canUndo 
                    ? "text-white/60 hover:text-white hover:bg-white/10" 
                    : "text-white/20 cursor-not-allowed"
                )}
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9",
                  canRedo 
                    ? "text-white/60 hover:text-white hover:bg-white/10" 
                    : "text-white/20 cursor-not-allowed"
                )}
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-white/10" />
        
        {/* Transform Tools */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {TRANSFORM_TOOLS.map(tool => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToolChange(tool.id)}
                  className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center transition-all",
                    activeTool === tool.id 
                      ? "bg-cyan-500/20 text-cyan-400" 
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  )}
                >
                  <tool.icon className="w-4 h-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>{tool.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-white/10" />
        
        {/* View Options */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9",
                  showGrid 
                    ? "bg-cyan-500/20 text-cyan-400" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
                onClick={onToggleGrid}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9",
                  snapEnabled 
                    ? "bg-cyan-500/20 text-cyan-400" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
                onClick={onToggleSnap}
              >
                <Magnet className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}