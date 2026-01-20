import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import Viewport3D from '@/components/editor/Viewport3D';
import PartsLibrary from '@/components/editor/PartsLibrary';
import PartsList from '@/components/editor/PartsList';
import Toolbar from '@/components/editor/Toolbar';
import PropertiesPanel from '@/components/editor/PropertiesPanel';
import ProjectsDialog from '@/components/editor/ProjectsDialog';
import SaveDialog from '@/components/editor/SaveDialog';

import { cn } from '@/lib/utils';

const PART_NAMES = {
  gear: 'Gear',
  shaft: 'Shaft',
  bearing: 'Bearing',
  motor: 'Motor',
  pulley: 'Pulley',
  belt: 'Belt',
  piston: 'Piston',
  bracket: 'Bracket',
  spring: 'Spring',
  bolt: 'Bolt',
  plate: 'Plate',
  coupler: 'Coupler',
};

// Simple UUID generator if uuid is not available
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function Editor() {
  const queryClient = useQueryClient();
  
  // Project state
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [projectDescription, setProjectDescription] = useState('');
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Tool state
  const [activeTool, setActiveTool] = useState('select');
  const [showGrid, setShowGrid] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(false);
  
  // Dialog state
  const [projectsDialogOpen, setProjectsDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-updated_date'),
  });
  
  // Save project mutation
  const saveMutation = useMutation({
    mutationFn: async ({ name, description }) => {
      const projectData = {
        name,
        description,
        parts,
      };
      
      if (currentProjectId) {
        await base44.entities.Project.update(currentProjectId, projectData);
        return { ...projectData, id: currentProjectId };
      } else {
        const newProject = await base44.entities.Project.create(projectData);
        return newProject;
      }
    },
    onSuccess: (project) => {
      setCurrentProjectId(project.id);
      setProjectName(project.name);
      setProjectDescription(project.description || '');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSaveDialogOpen(false);
      toast.success('Project saved successfully');
    },
    onError: () => {
      toast.error('Failed to save project');
    },
  });
  
  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
  });
  
  // Add history entry
  const addToHistory = useCallback((newParts) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newParts)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);
  
  // Add part
  const handleAddPart = useCallback((type) => {
    const partCount = parts.filter(p => p.type === type).length;
    const newPart = {
      id: generateId(),
      type,
      name: `${PART_NAMES[type]} ${partCount + 1}`,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
    
    const newParts = [...parts, newPart];
    setParts(newParts);
    addToHistory(newParts);
    setSelectedPart(newPart.id);
    toast.success(`Added ${PART_NAMES[type]}`);
  }, [parts, addToHistory]);
  
  // Update part
  const handleUpdatePart = useCallback((id, updates) => {
    const newParts = parts.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    setParts(newParts);
  }, [parts]);
  
  // Delete part
  const handleDeletePart = useCallback((id) => {
    const newParts = parts.filter(p => p.id !== id);
    setParts(newParts);
    addToHistory(newParts);
    if (selectedPart === id) {
      setSelectedPart(null);
    }
    toast.success('Part deleted');
  }, [parts, selectedPart, addToHistory]);
  
  // Duplicate part
  const handleDuplicatePart = useCallback((id) => {
    const part = parts.find(p => p.id === id);
    if (!part) return;
    
    const newPart = {
      ...part,
      id: generateId(),
      name: `${part.name} (Copy)`,
      position: {
        x: part.position.x + 0.5,
        y: part.position.y,
        z: part.position.z + 0.5,
      },
    };
    
    const newParts = [...parts, newPart];
    setParts(newParts);
    addToHistory(newParts);
    setSelectedPart(newPart.id);
    toast.success('Part duplicated');
  }, [parts, addToHistory]);
  
  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setParts(JSON.parse(JSON.stringify(history[historyIndex - 1])));
      setSelectedPart(null);
    }
  }, [history, historyIndex]);
  
  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setParts(JSON.parse(JSON.stringify(history[historyIndex + 1])));
      setSelectedPart(null);
    }
  }, [history, historyIndex]);
  
  // New project
  const handleNew = useCallback(() => {
    setCurrentProjectId(null);
    setProjectName('Untitled Project');
    setProjectDescription('');
    setParts([]);
    setSelectedPart(null);
    setHistory([]);
    setHistoryIndex(-1);
    toast.success('New project created');
  }, []);
  
  // Load project
  const handleLoadProject = useCallback((project) => {
    setCurrentProjectId(project.id);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setParts(project.parts || []);
    setSelectedPart(null);
    setHistory([project.parts || []]);
    setHistoryIndex(0);
    setProjectsDialogOpen(false);
    toast.success(`Loaded: ${project.name}`);
  }, []);
  
  // Export (placeholder)
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify({ name: projectName, parts }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `${projectName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Project exported');
  }, [projectName, parts]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'v' || e.key === 'V') setActiveTool('select');
      if (e.key === 'g' || e.key === 'G') setActiveTool('translate');
      if (e.key === 'r' || e.key === 'R') setActiveTool('rotate');
      if (e.key === 's' || e.key === 'S' && !e.ctrlKey && !e.metaKey) setActiveTool('scale');
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedPart) handleDeletePart(selectedPart);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveDialogOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPart, handleDeletePart, handleUndo, handleRedo]);
  
  return (
    <div className="h-screen w-screen bg-[#0a0a12] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        snapEnabled={snapEnabled}
        onToggleSnap={() => setSnapEnabled(!snapEnabled)}
        onSave={() => setSaveDialogOpen(true)}
        onLoad={() => setProjectsDialogOpen(true)}
        onNew={handleNew}
        onExport={handleExport}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Parts Library */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 bg-[#0d0d14]/95 backdrop-blur-xl border-r border-white/5 flex flex-col"
        >
          <PartsLibrary onAddPart={handleAddPart} />
        </motion.aside>
        
        {/* Center - 3D Viewport */}
        <div className="flex-1 relative">
          <Viewport3D
            parts={parts}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            activeTool={activeTool}
            showGrid={showGrid}
            onUpdatePart={handleUpdatePart}
          />
          
          {/* Project name overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-sm font-medium text-white/80">{projectName}</span>
          </div>
        </div>
        
        {/* Right sidebar - Parts List & Properties */}
        <motion.aside
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="w-72 bg-[#0d0d14]/95 backdrop-blur-xl border-l border-white/5 flex flex-col"
        >
          {/* Parts List */}
          <div className="h-1/2 border-b border-white/5">
            <PartsList
              parts={parts}
              selectedPart={selectedPart}
              onSelectPart={setSelectedPart}
              onDeletePart={handleDeletePart}
              onDuplicatePart={handleDuplicatePart}
            />
          </div>
          
          {/* Properties Panel */}
          <div className="h-1/2">
            <PropertiesPanel
              selectedPart={selectedPart}
              parts={parts}
              onUpdatePart={handleUpdatePart}
            />
          </div>
        </motion.aside>
      </div>
      
      {/* Dialogs */}
      <ProjectsDialog
        open={projectsDialogOpen}
        onOpenChange={setProjectsDialogOpen}
        projects={projects}
        onLoadProject={handleLoadProject}
        onDeleteProject={(id) => deleteMutation.mutate(id)}
        isLoading={projectsLoading}
      />
      
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        projectName={projectName}
        projectDescription={projectDescription}
        onSave={(data) => saveMutation.mutate(data)}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}