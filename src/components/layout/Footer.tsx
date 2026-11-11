import { GraduationCap } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-start">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-800 text-accent-300">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-bold text-primary-950">Profify</span>
        </div>
        <p className="text-sm text-slate-600">{t('footerText')}</p>
        <p className="text-xs text-slate-500">{t('copyright')}</p>
      </div>
    </footer>
  );
}
