import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type GlowColor = 'training' | 'xp' | 'health' | 'achieve' | 'social';

const colorMap: Record<GlowColor, string> = {
  training: 'bg-training',
  xp:       'bg-xp',
  health:   'bg-health',
  achieve:  'bg-achieve',
  social:   'bg-social',
};

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: GlowColor;
}

export function Card({ children, className, style, glow }: CardProps) {
  // Glow uses background colors now in the Neobrutalist style
  const bgColor = glow ? colorMap[glow] : 'bg-surface';
  return (
    <div
      className={cn(
        'brut-border brut-shadow rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
        bgColor,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
