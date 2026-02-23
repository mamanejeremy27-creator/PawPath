import type { ReactNode } from 'react';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: ReactNode;
}

export function ProgressRing({
  value,
  size = 88,
  strokeWidth = 8,
  color = '#000000',
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = (1 - Math.min(Math.max(value, 0), 100) / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center bg-white rounded-full brut-border-sm brut-shadow-sm" style={{ width: size + 16, height: size + 16 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
