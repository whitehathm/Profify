import { GraduationCap } from 'lucide-react';
import type { View } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';
import type { StringKey } from '@/i18n/strings';

const FOOTER_LINKS: { view: View; labelKey: StringKey }[] = [
  { view: 'discover', labelKey: 'navFindTutoring' },
  { view: 'how-it-works', labelKey: 'navHowItWorks' },
  { view: 'become-tutor', labelKey: 'navBecomeTutor' },
  { view: 'contact', labelKey: 'navContact' },
];

export function Footer() {
  const { t, navigate } = useApp();
  return (
    <footer className="border-t border-primary-900 bg-primary-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-9 text-center sm:flex-row sm:px-6 sm:text-start">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-white">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-bold text-white">Profify</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map(({ view, labelKey }) => (
            <button
              key={view}
              type="button"
              onClick={() => navigate(view)}
              className="text-sm font-medium text-white/75 transition duration-200 hover:text-white"
            >
              {t(labelKey)}
            </button>
          ))}
        </nav>
        <p className="text-xs text-white/55">{t('copyright')}</p>
      </div>
    </footer>
  );
}
