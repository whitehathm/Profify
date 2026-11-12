import type { ReactNode } from 'react';

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition duration-200 ${
        active
          ? 'border-primary-300 bg-primary-50 text-primary-800 shadow-sm'
          : 'border-secondary-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800'
      }`}
    >
      {children}
    </button>
  );
}
