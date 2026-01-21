import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * A Roblox Studio-style draggable number input.
 * Click and drag on the label to change the value, or click the value to type directly.
 */
export default function DraggableNumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  sensitivity = 0.1,
  labelColor = 'text-muted-foreground',
  className,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const dragStartRef = useRef({ x: 0, value: 0 });
  const inputRef = useRef(null);

  // Update input value when external value changes (and not editing)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(formatValue(value));
    }
  }, [value, isEditing]);

  const formatValue = (val) => {
    // Round to avoid floating point issues
    const rounded = Math.round(val * 1000) / 1000;
    return rounded.toString();
  };

  const clampValue = (val) => {
    let clamped = val;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    return clamped;
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, value };
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [value]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const delta = e.clientX - dragStartRef.current.x;
    // Use shift for fine control, ctrl/cmd for coarse control
    let effectiveSensitivity = sensitivity;
    if (e.shiftKey) effectiveSensitivity *= 0.1;
    if (e.ctrlKey || e.metaKey) effectiveSensitivity *= 10;

    const newValue = dragStartRef.current.value + delta * effectiveSensitivity;

    // Snap to step
    const snapped = Math.round(newValue / step) * step;
    const clamped = clampValue(snapped);

    onChange(clamped);
  }, [isDragging, sensitivity, step, onChange, min, max]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleValueClick = () => {
    setIsEditing(true);
    setInputValue(formatValue(value));
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = clampValue(parsed);
      onChange(clamped);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(formatValue(value));
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Draggable Label */}
      <button
        type="button"
        onMouseDown={handleMouseDown}
        className={cn(
          "w-6 h-7 flex items-center justify-center rounded text-xs font-bold select-none transition-all",
          "bg-muted/50 hover:bg-muted cursor-ew-resize",
          "border border-transparent hover:border-border",
          isDragging && "bg-muted border-border ring-1 ring-ring/20",
          labelColor
        )}
        title={`Drag to adjust ${label}`}
      >
        {label}
      </button>

      {/* Value Display / Input */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          step={step}
          min={min}
          max={max}
          className={cn(
            "flex-1 h-7 px-2 rounded text-sm bg-background border border-ring",
            "text-foreground outline-none",
            "focus:ring-1 focus:ring-ring"
          )}
          autoFocus
        />
      ) : (
        <button
          type="button"
          onClick={handleValueClick}
          className={cn(
            "flex-1 h-7 px-2 rounded text-sm text-left",
            "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border",
            "text-foreground transition-colors cursor-text"
          )}
          title="Click to edit"
        >
          {formatValue(value)}
        </button>
      )}
    </div>
  );
}
