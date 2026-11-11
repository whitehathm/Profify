import type { InputHTMLAttributes, ReactNode } from 'react';

export const inputBase =
  'w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-primary-950 placeholder:text-slate-500 transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100';

export const inputClass = `${inputBase} px-4`;
export const searchInputClass = `${inputBase} ps-11 pe-4`;

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-primary-950">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-error-600">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}
