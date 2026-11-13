import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import type { StringKey } from '@/i18n/strings';

const STEPS: { titleKey: StringKey; bodyKey: StringKey }[] = [
  { titleKey: 'howStep1Title', bodyKey: 'howStep1Body' },
  { titleKey: 'howStep2Title', bodyKey: 'howStep2Body' },
  { titleKey: 'howStep3Title', bodyKey: 'howStep3Body' },
];

function LessonIllustration() {
  return (
    <svg viewBox="0 0 320 220" fill="none" className="mx-auto h-auto w-full max-w-md" aria-hidden="true">
      <ellipse cx="160" cy="112" rx="150" ry="98" fill="#FFF0F3" />
      <rect x="66" y="40" width="188" height="120" rx="14" fill="#FFFFFF" stroke="#121117" strokeWidth="2.5" />
      <rect x="78" y="52" width="164" height="96" rx="6" fill="#FFD6DF" />
      <circle cx="160" cy="92" r="20" fill="#FF5A79" stroke="#121117" strokeWidth="2.5" />
      <path d="M160 82a10 10 0 0 1 0 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M118 132c4-14 20-18 42-18s38 4 42 18" fill="#121117" />
      <path d="M40 160h240l-14 14H54z" fill="#FFFFFF" stroke="#121117" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="140" y="160" width="40" height="6" rx="3" fill="#121117" />
      <rect x="200" y="62" width="44" height="18" rx="9" fill="#FFFFFF" stroke="#121117" strokeWidth="2.5" />
      <circle cx="210" cy="71" r="4" fill="#FF5A79" />
      <path d="M226 67h10M226 73h6" stroke="#121117" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 116l10 10M250 128l-6 8" stroke="#FF5A79" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function HowItWorksPage() {
  const { t, navigate } = useApp();

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <LessonIllustration />
        <h1 className="mx-auto mt-8 max-w-2xl text-3xl font-extrabold leading-[1.15] tracking-tight text-primary-950 sm:text-4xl">
          {t('howTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">{t('howSubtitle')}</p>

        <ol className="mx-auto mt-14 grid max-w-3xl gap-10 text-center sm:grid-cols-3 sm:gap-8">
          {STEPS.map(({ titleKey, bodyKey }, index) => (
            <li key={titleKey} className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-lg font-extrabold text-primary-950 shadow-sm">
                {index + 1}
              </span>
              <h2 className="mt-5 text-lg font-bold text-primary-950">{t(titleKey)}</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{t(bodyKey)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="rounded-full bg-primary-950 px-8 text-white hover:bg-primary-900" onClick={() => navigate('discover')}>
            {t('navFindTutoring')}
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => navigate('become-tutor')}>
            {t('becomeTutorCta')}
          </Button>
        </div>
      </section>
    </div>
  );
}
