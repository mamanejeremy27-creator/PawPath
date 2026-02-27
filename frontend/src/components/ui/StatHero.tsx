import { cn } from '../../lib/cn';

interface StatHeroProps {
  value: string | number;
  label: string;
  unit?: string;
  colorClass?: string;
  sublabel?: string;
}

export function StatHero({ value, label, unit, colorClass = 'text-black', sublabel }: StatHeroProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('font-display text-5xl font-black leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)]', colorClass)}>
        {value}
        {unit && <span className="text-2xl font-bold ms-1">{unit}</span>}
      </div>
      <div className="text-black text-[11px] tracking-widest uppercase font-black bg-white/40 px-2 py-0.5 rounded-sm brut-border-sm">{label}</div>
      {sublabel && <div className="text-muted text-[12px] font-bold mt-1">{sublabel}</div>}
    </div>
  );
}
