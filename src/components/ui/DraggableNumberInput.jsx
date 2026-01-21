import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const safeValue = (typeof value === 'number' && !isNaN(value)) ? value : 0;
  const safeStep = step || 0.1;
  const safeSensitivity = sensitivity || 0.1;
  const safeLabelColor = labelColor || 'text-muted-foreground';

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(safeValue));
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startValue: 0
  });

  const inputRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(function() {
    onChangeRef.current = onChange;
  }, [onChange]);

  function formatNumber(val) {
    if (typeof val !== 'number' || isNaN(val)) return '0';
    return String(Math.round(val * 1000) / 1000);
  }

  function clamp(val) {
    var result = val;
    if (typeof min === 'number') result = Math.max(min, result);
    if (typeof max === 'number') result = Math.min(max, result);
    return result;
  }

  useEffect(function() {
    if (!isEditing) {
      setInputValue(formatNumber(safeValue));
    }
  }, [safeValue, isEditing]);

  // Global mouse event handlers
  useEffect(function() {
    function handleGlobalMouseMove(e) {
      if (!dragRef.current.active) return;

      var delta = e.clientX - dragRef.current.startX;
      var sens = safeSensitivity;
      if (e.shiftKey) sens = sens * 0.1;
      if (e.ctrlKey || e.metaKey) sens = sens * 10;

      var newVal = dragRef.current.startValue + delta * sens;
      var snapped = Math.round(newVal / safeStep) * safeStep;
      var clamped = clamp(snapped);

      if (onChangeRef.current) {
        onChangeRef.current(clamped);
      }
    }

    function handleGlobalMouseUp() {
      if (!dragRef.current.active) return;

      dragRef.current.active = false;
      setDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return function() {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [safeSensitivity, safeStep, min, max]);

  function handleLabelMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    dragRef.current.active = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startValue = safeValue;

    setDragging(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

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
        onMouseDown={handleLabelMouseDown}
        className={cn(
          "w-6 h-7 flex items-center justify-center rounded text-xs font-bold select-none transition-all",
          "bg-muted/50 hover:bg-muted cursor-ew-resize",
          "border border-transparent hover:border-border",
          dragging && "bg-muted border-border ring-1 ring-ring/20",
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
