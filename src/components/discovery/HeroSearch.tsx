import { CITIES, POPULAR_SUBJECT_IDS, subjectLabel } from '@/data/catalog';
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
      <span className="mb-1.5 block px-1 text-xs font-bold text-slate-900">{label}</span>
      {children}
    </div>
  );
}

export function HeroSearch({ filters, onChange, onSearch }: HeroSearchProps) {
  const { t, lang } = useApp();

  return (
    <section className="relative isolate overflow-hidden bg-white text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:pt-20">
        <div className="max-w-3xl animate-slide-up">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-[#6366F1] border border-indigo-200">
            {t('tagline')}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl leading-[1.15]">
            {lang === 'ar' ? (
              <>
                ابحث عن <span className="text-[#6366F1]">أستاذك المثالي</span> لدروس الدعم واللغات في المغرب
              </>
            ) : (
              t('heroTitle')
            )}
          </h1>
          <p className="mt-4 text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
            {t('heroSubtitle')}
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="mt-8 grid gap-4 rounded-2xl bg-white p-5 shadow-lg border border-slate-900/10 ring-1 ring-slate-900/5 animate-slide-up sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-end"
        >
          <SearchField label={t('fieldSubject')}>
            <SubjectCombobox value={filters.subjectId} onChange={(subjectId) => onChange({ subjectId })} />
          </SearchField>

          <SearchField label={t('fieldCity')}>
            <select
              className={`${inputClass} bg-white text-slate-900 border-slate-300 focus:border-[#6366F1] focus:ring-[#6366F1]`}
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
              className={`${inputClass} bg-white text-slate-900 border-slate-300 focus:border-[#6366F1] focus:ring-[#6366F1]`}
              value={filters.mode}
              onChange={(event) => onChange({ mode: event.target.value as TutorFilters['mode'] })}
            >
              <option value="all">{t('modeAll')}</option>
              <option value="online">{t('modeOnline')}</option>
              <option value="in_person">{t('modeInPerson')}</option>
            </select>
          </SearchField>

          <Button
            type="submit"
            size="lg"
            icon={<Search className="h-4 w-4" />}
            className="w-full sm:w-auto bg-[#6366F1] hover:bg-[#4F46E5] text-white border border-[#6366F1] font-bold shadow-sm rounded-xl px-6 py-3"
          >
            {t('searchButton')}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">{t('popularSubjects')}</span>
          {POPULAR_SUBJECT_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ subjectId: id })}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800 border border-slate-200 transition hover:bg-[#6366F1] hover:text-white hover:border-[#4F46E5]"
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
