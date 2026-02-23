import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type GlowColor = 'training' | 'xp' | 'health' | 'achieve' | 'social';

const glowShadow: Record<GlowColor, string> = {
  training: '0 0 24px 0 rgba(34,197,94,0.12)',
  xp:       '0 0 24px 0 rgba(245,158,11,0.12)',
  health:   '0 0 24px 0 rgba(59,130,246,0.12)',
  achieve:  '0 0 24px 0 rgba(139,92,246,0.12)',
  social:   '0 0 24px 0 rgba(99,102,241,0.12)',
};

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: GlowColor;
}

export function Card({ children, className, style, glow }: CardProps) {
  const mergedStyle: CSSProperties = {
    ...(glow ? { boxShadow: glowShadow[glow] } : {}),
    ...style,
  };
  return (
    <div
      className={cn('bg-surface border border-border rounded-3xl p-5', className)}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
    >
      {children}
    </div>
  );
}
