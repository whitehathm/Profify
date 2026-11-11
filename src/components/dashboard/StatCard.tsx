import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'primary' | 'accent' | 'success' | 'warning';
}

const TONES: Record<StatCardProps['tone'], string> = {
  primary: 'bg-primary-50 text-primary-700',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
};

export function StatCard({ icon, label, value, tone }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-600">{label}</p>
        <p className="text-2xl font-bold text-primary-950">{value}</p>
      </div>
    </div>
  );
}
