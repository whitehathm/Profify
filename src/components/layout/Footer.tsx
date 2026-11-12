import { GraduationCap } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="border-t border-primary-900 bg-primary-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-9 text-center sm:flex-row sm:px-6 sm:text-start">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-white">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-bold text-white">Profify</span>
        </div>
        <p className="max-w-md text-sm text-white/75">{t('footerText')}</p>
        <p className="text-xs text-white/55">{t('copyright')}</p>
      </div>
    </footer>
  );
}
