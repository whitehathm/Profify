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
        <button
          type="button"
          onClick={() => navigate('discover')}
          className="flex items-center gap-2.5 rounded-full transition duration-200 active:scale-[0.98]"
          aria-label="Profify"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="40" height="40" rx="11" fill="#FF5A79" />
            <path
              d="M14.5 29V15.5C14.5 12.4624 16.9624 10 20 10H22.5C25.8137 10 28.5 12.6863 28.5 16C28.5 19.3137 25.8137 22 22.5 22H18.5"
              stroke="#FFFFFF"
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="22.5" cy="28" r="2.4" fill="#121117" />
          </svg>
          <span className="text-lg font-extrabold tracking-tight text-white">Profify</span>
        </button>

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