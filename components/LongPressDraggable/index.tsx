import React, { useState, useRef, useEffect } from 'react';

interface LongPressDraggableProps {
  onLongPress?: () => void;
  initialPosition?: { x: number; y: number };
  className?: string;
  onDrag?: (position: { x: number; y: number }) => void;
}

const LongPressDraggable: React.FC<LongPressDraggableProps> = ({
  onLongPress,
  initialPosition,
  className = '',
  onDrag
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pressProgress, setPressProgress] = useState(0);
  const longPressTimer = useRef<number | null>(null);
  const progressTimer = useRef<number | null>(null);
  const initialMousePosition = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centerPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    const finalPosition = initialPosition || centerPosition;
    setPosition(finalPosition);
    initialPos.current = finalPosition;

    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [initialPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    initialMousePosition.current = { x: e.clientX, y: e.clientY };
    initialPos.current = position;
    setPressProgress(0);

    setIsDragging(true);

    progressTimer.current = window.setInterval(() => {
      setPressProgress(prev => Math.min(prev + 1, 100));
    }, 5);

    longPressTimer.current = window.setTimeout(() => {
      onLongPress?.();
      if (progressTimer.current) clearInterval(progressTimer.current);
    }, 500);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      const dx = Math.abs(e.clientX - initialMousePosition.current.x);
      const dy = Math.abs(e.clientY - initialMousePosition.current.y);
      if (dx > 5 || dy > 5) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        if (progressTimer.current) {
          clearInterval(progressTimer.current);
          progressTimer.current = null;
        }
        setPressProgress(0);
      }
    }

    const newX = initialPos.current.x + (e.clientX - initialMousePosition.current.x);
    const newY = initialPos.current.y + (e.clientY - initialMousePosition.current.y);
    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onDrag?.(newPosition);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    setPressProgress(0);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`draggable ${className}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transform: `scale(${1 + pressProgress * 0.05 / 100})`,
        transition: 'transform 0.05s linear',
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ 
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '4px',
        backgroundColor: '#eee',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${pressProgress}%`,
          height: '100%',
          backgroundColor: '#1890ff',
          transition: 'width 0.05s linear'
        }} />
      </div>
      长按我或者拖拽我
    </div>
  );
};

export default LongPressDraggable;