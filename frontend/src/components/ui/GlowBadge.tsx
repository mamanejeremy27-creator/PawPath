import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeColor = 'training' | 'xp' | 'health' | 'achieve' | 'social' | 'danger';

const colorMap: Record<BadgeColor, { classes: string; glow: string }> = {
  training: { classes: 'bg-training/15 border-training/30 text-training', glow: 'rgba(34,197,94,0.25)'  },
  xp:       { classes: 'bg-xp/15 border-xp/30 text-xp',                   glow: 'rgba(245,158,11,0.25)' },
  health:   { classes: 'bg-health/15 border-health/30 text-health',        glow: 'rgba(59,130,246,0.25)' },
  achieve:  { classes: 'bg-achieve/15 border-achieve/30 text-achieve',     glow: 'rgba(139,92,246,0.25)' },
  social:   { classes: 'bg-social/15 border-social/30 text-social',        glow: 'rgba(99,102,241,0.25)' },
  danger:   { classes: 'bg-danger/15 border-danger/30 text-danger',        glow: 'rgba(239,68,68,0.25)'  },
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
  const { classes, glow } = colorMap[color];
  return (
    <span
      className={cn('inline-flex items-center rounded-full font-bold border', sizeMap[size], classes)}
      style={{ boxShadow: `0 0 8px ${glow}` }}
    >
      {children}
    </span>
  );
}
