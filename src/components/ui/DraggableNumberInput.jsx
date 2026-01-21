import React, { useState, useRef, useEffect } from 'react';
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
  step,
  sensitivity,
  labelColor,
  className,
}) {
  // Safe defaults
  const safeValue = (typeof value === 'number' && !isNaN(value)) ? value : 0;
  const safeStep = step || 0.1;
  const safeSensitivity = sensitivity || 0.1;
  const safeLabelColor = labelColor || 'text-muted-foreground';

  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(safeValue));
  const dragStartRef = useRef({ x: 0, startValue: 0 });
  const inputRef = useRef(null);

  // Format a number for display
  function formatNumber(val) {
    if (typeof val !== 'number' || isNaN(val)) return '0';
    return String(Math.round(val * 1000) / 1000);
  }

  // Clamp value to min/max bounds
  function clamp(val) {
    let result = val;
    if (typeof min === 'number') result = Math.max(min, result);
    if (typeof max === 'number') result = Math.min(max, result);
    return result;
  }

  // Sync input value when external value changes
  useEffect(function syncValue() {
    if (!isEditing) {
      setInputValue(formatNumber(safeValue));
    }
  }, [safeValue, isEditing]);

  // Handle drag start on label
  function handleMouseDown(e) {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, startValue: safeValue };
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  // Handle drag movement
  useEffect(function handleDrag() {
    if (!isDragging) return;

    function onMouseMove(e) {
      var delta = e.clientX - dragStartRef.current.x;
      var sens = safeSensitivity;
      if (e.shiftKey) sens = sens * 0.1;
      if (e.ctrlKey || e.metaKey) sens = sens * 10;

      var newVal = dragStartRef.current.startValue + delta * sens;
      var snapped = Math.round(newVal / safeStep) * safeStep;
      var clamped = clamp(snapped);

      onChange(clamped);
    }

    function onMouseUp() {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return function cleanup() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, safeSensitivity, safeStep, onChange, min, max]);

  // Click on value to edit
  function handleValueClick() {
    setIsEditing(true);
    setInputValue(formatNumber(safeValue));
    setTimeout(function() {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleInputBlur() {
    setIsEditing(false);
    var parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      onChange(clamp(parsed));
    }
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(formatNumber(safeValue));
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onMouseDown={handleMouseDown}
        className={cn(
          "w-6 h-7 flex items-center justify-center rounded text-xs font-bold select-none transition-all",
          "bg-muted/50 hover:bg-muted cursor-ew-resize",
          "border border-transparent hover:border-border",
          isDragging && "bg-muted border-border ring-1 ring-ring/20",
          safeLabelColor
        )}
        title={"Drag to adjust " + label}
      >
        {label}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          step={safeStep}
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
          {formatNumber(safeValue)}
        </button>
      )}
    </div>
  );
}
