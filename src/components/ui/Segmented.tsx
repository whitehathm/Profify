import type { ReactNode } from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedProps<T extends string> {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
}

export function Segmented<T extends string>({ label, options, value, onChange, compact = false }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full items-center rounded-xl bg-slate-100 p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors duration-200 ${
              compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
            } ${active ? 'bg-primary-950 text-white shadow-sm' : 'text-slate-600 hover:text-primary-700'}`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
