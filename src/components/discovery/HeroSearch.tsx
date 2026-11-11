import { CITIES, HERO_IMAGE, POPULAR_SUBJECT_IDS, subjectLabel } from '@/data/catalog';
import type { TeachingMode, TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { inputClass } from '@/components/ui/Field';
import { Search } from 'lucide-react';
import { SubjectCombobox } from '@/components/discovery/SubjectCombobox';

interface HeroSearchProps {
  filters: TutorFilters;
  onChange: (patch: Partial<TutorFilters>) => void;
  onSearch: () => void;
}

function SearchField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block px-1 text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </div>
  );
}

export function HeroSearch({ filters, onChange, onSearch }: HeroSearchProps) {
  const { t, lang } = useApp();

  return (
    <section className="relative isolate overflow-hidden bg-primary-950">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-950/60 via-primary-900/85 to-primary-950" />

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:pt-24">
        <div className="max-w-2xl animate-slide-up">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent-200 ring-1 ring-white/15">
            {t('tagline')}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.2] text-white sm:text-5xl lg:text-6xl">{t('heroTitle')}</h1>
          <p className="mt-4 text-base leading-relaxed text-primary-100 sm:text-lg">{t('heroSubtitle')}</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="mt-10 grid gap-4 rounded-2xl bg-white p-4 shadow-2xl animate-slide-up sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-end"
        >
          <SearchField label={t('fieldSubject')}>
            <SubjectCombobox value={filters.subjectId} onChange={(subjectId) => onChange({ subjectId })} />
          </SearchField>

          <SearchField label={t('fieldCity')}>
            <select
              className={inputClass}
              value={filters.cityId ?? ''}
              onChange={(event) => onChange({ cityId: event.target.value || null })}
            >
              <option value="">{t('allCities')}</option>
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.label[lang]}
                </option>
              ))}
            </select>
          </SearchField>

          <SearchField label={t('fieldMode')}>
            <select
              className={inputClass}
              value={filters.mode}
              onChange={(event) => onChange({ mode: event.target.value as TutorFilters['mode'] })}
            >
              <option value="all">{t('modeAll')}</option>
              <option value="online">{t('modeOnline')}</option>
              <option value="in_person">{t('modeInPerson')}</option>
            </select>
          </SearchField>

          <Button type="submit" size="lg" icon={<Search className="h-4 w-4" />} className="w-full sm:w-auto">
            {t('searchButton')}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-primary-200">{t('popularSubjects')}</span>
          {POPULAR_SUBJECT_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ subjectId: id })}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              {subjectLabel(id, lang)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { TeachingMode };
