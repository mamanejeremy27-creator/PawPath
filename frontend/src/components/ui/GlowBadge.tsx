import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeColor = 'training' | 'xp' | 'health' | 'achieve' | 'social' | 'danger';

const colorMap: Record<BadgeColor, string> = {
  training: 'bg-training text-black',
  xp:       'bg-xp text-black',
  health:   'bg-health text-black',
  achieve:  'bg-achieve text-black',
  social:   'bg-social text-black',
  danger:   'bg-danger text-black',
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

interface GlowBadgeProps {
  children: ReactNode;
  color: BadgeColor;
  size?: 'sm' | 'md';
}

export function GlowBadge({ children, color, size = 'md' }: GlowBadgeProps) {
  const colorClass = colorMap[color];
  return (
    <span
      className={cn('inline-flex items-center rounded-sm font-black brut-border-sm uppercase tracking-wider', sizeMap[size], colorClass)}
    >
      {children}
    </span>
  );
}
