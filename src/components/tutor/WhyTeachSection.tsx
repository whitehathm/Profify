import type { ComponentType } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { CalendarIllustration, CoinIllustration, HeartHandIllustration } from '@/components/tutor/WhyTeachIllustrations';

const BENEFITS: {
  Illustration: ComponentType<{ className?: string }>;
  titleKey: 'earnTitle' | 'scheduleTitle' | 'connectTitle';
  bodyKey: 'earnBody' | 'scheduleBody' | 'connectBody';
}[] = [
  { Illustration: CoinIllustration, titleKey: 'earnTitle', bodyKey: 'earnBody' },
  { Illustration: CalendarIllustration, titleKey: 'scheduleTitle', bodyKey: 'scheduleBody' },
  { Illustration: HeartHandIllustration, titleKey: 'connectTitle', bodyKey: 'connectBody' },
];

export function WhyTeachSection() {
  const { t, openModal } = useApp();

  return (
    <section className="bg-[#FFF0F3]">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-[1.15] tracking-tight text-primary-950 sm:text-4xl">
          {t('whyTeachTitle')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">{t('whyTeachSubtitle')}</p>

        <div className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8">
          {BENEFITS.map(({ Illustration, titleKey, bodyKey }) => (
            <div key={titleKey} className="flex flex-col items-center text-center">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <span aria-hidden="true" className="absolute inset-3 rounded-[42%_58%_60%_40%/50%_42%_58%_50%] bg-[#FFD6DF]" />
                <Illustration className="relative h-32 w-32" />
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-primary-950">{t(titleKey)}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{t(bodyKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button
            size="lg"
            className="rounded-full bg-primary-950 px-8 text-white shadow-sm hover:bg-primary-900"
            onClick={() => openModal({ type: 'become-tutor' })}
          >
            {t('becomeTutorCta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
