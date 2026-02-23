import { cn } from '../../lib/cn';

interface StatHeroProps {
  value: string | number;
  label: string;
  unit?: string;
  colorClass?: string;
  sublabel?: string;
}

export function StatHero({ value, label, unit, colorClass = 'text-text', sublabel }: StatHeroProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('font-display text-5xl font-black leading-none', colorClass)}>
        {value}
        {unit && <span className="text-2xl font-bold ms-0.5">{unit}</span>}
      </div>
      <div className="text-muted text-[10px] tracking-widest uppercase font-bold">{label}</div>
      {sublabel && <div className="text-muted text-[11px]">{sublabel}</div>}
    </div>
  );
}
