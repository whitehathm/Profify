import type { ReactNode } from 'react';
import { CITIES, POPULAR_SUBJECT_IDS, subjectLabel } from '@/data/catalog';
import type { TeachingMode, TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { inputClass } from '@/components/ui/Field';
import { GraduationCap, Search } from 'lucide-react';
import { SubjectCombobox } from '@/components/discovery/SubjectCombobox';

interface HeroSearchProps {
  filters: TutorFilters;
  onChange: (patch: Partial<TutorFilters>) => void;
  onSearch: () => void;
}

function SearchField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block px-1 text-xs font-semibold text-primary-950">{label}</span>
      {children}
    </div>
  );
}

export function HeroSearch({ filters, onChange, onSearch }: HeroSearchProps) {
  const { t, lang, openModal } = useApp();

  return (
    <section className="relative isolate border-b border-secondary-200 bg-white text-primary-950">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:pb-16 lg:pt-16">
        <div className="max-w-3xl animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-800">
            <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
            {t('tagline')}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-primary-950 sm:text-5xl lg:text-6xl">
            {lang === 'ar' ? (
              <>
                ابحث عن <span className="text-primary-700">أستاذك المثالي</span> لدروس الدعم واللغات في المغرب
              </>
            ) : lang === 'fr' ? (
              <>Trouvez le <span className="text-primary-700">professeur idéal</span></>
            ) : (
              <>Find your <span className="text-primary-700">perfect tutor</span></>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t('heroSubtitle')}
          </p>
          <Button
            type="button"
            variant="accent"
            onClick={() => openModal({ type: 'become-tutor' })}
            icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}
            className="mt-6 w-full sm:w-auto"
          >
            {t('becomeTutor')}
          </Button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="mt-8 grid gap-4 rounded-3xl border border-secondary-200 bg-white p-4 shadow-card sm:p-5 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end"
        >
          <SearchField label={t('fieldSubject')}>
            <SubjectCombobox value={filters.subjectId} onChange={(subjectId) => onChange({ subjectId })} />
          </SearchField>

          <SearchField label={t('fieldCity')}>
            <select
              className={`${inputClass} bg-white text-primary-950`}
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
              className={`${inputClass} bg-white text-primary-950`}
              value={filters.mode}
              onChange={(event) => onChange({ mode: event.target.value as TutorFilters['mode'] })}
            >
              <option value="all">{t('modeAll')}</option>
              <option value="online">{t('modeOnline')}</option>
              <option value="in_person">{t('modeInPerson')}</option>
            </select>
          </SearchField>

          <Button type="submit" size="lg" icon={<Search className="h-4 w-4" aria-hidden="true" />} className="w-full px-6 sm:w-auto">
            {t('searchButton')}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="me-1 text-sm font-semibold text-slate-600">{t('popularSubjects')}</span>
          {POPULAR_SUBJECT_IDS.map((id) => {
            const active = filters.subjectId === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ subjectId: active ? null : id })}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active
                  ? 'border-primary-300 bg-primary-50 text-primary-800'
                  : 'border-secondary-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800'}`}
              >
                {subjectLabel(id, lang)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export type { TeachingMode };
