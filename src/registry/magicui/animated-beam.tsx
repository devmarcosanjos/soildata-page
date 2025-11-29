import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  fromRef: React.RefObject<HTMLDivElement | null>;
  toRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

interface BeamPoints {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className,
  color = 'var(--color-orange-secondary)',
  strokeWidth = 2,
}: AnimatedBeamProps) {
  const [points, setPoints] = useState<BeamPoints | null>(null);

  useEffect(() => {
    function updatePoints() {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;

      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left + toRect.width / 2 - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;

      setPoints({ fromX, fromY, toX, toY });
    }

    updatePoints();
    window.addEventListener('resize', updatePoints);
    window.addEventListener('scroll', updatePoints, true);

    return () => {
      window.removeEventListener('resize', updatePoints);
      window.removeEventListener('scroll', updatePoints, true);
    };
  }, [containerRef, fromRef, toRef]);

  const pathD = useMemo(() => {
    if (!points) return null;
    const { fromX, fromY, toX, toY } = points;

    const controlX = (fromX + toX) / 2;
    const controlY = Math.min(fromY, toY) - Math.abs(toX - fromX) * 0.15;

    return `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
  }, [points]);

  if (!points || !pathD) return null;

  return (
    <svg
      className={cn(
        'pointer-events-none absolute inset-0 overflow-visible',
        className,
      )}
    >
      <defs>
        <linearGradient id="soildata-beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="30%" stopColor={color} stopOpacity="0.4" />
          <stop offset="70%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke="url(#soildata-beam-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        className="animated-beam"
      />
    </svg>
  );
}
