import { MessageSquare, Search } from 'lucide-react';
import { CITIES, SUBJECTS } from '@/data/catalog';
import type { TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';

interface HeroSearchProps {
  filters: TutorFilters;
  onChange: (patch: Partial<TutorFilters>) => void;
  onSearch: () => void;
}

export function HeroSearch({ filters, onChange, onSearch }: HeroSearchProps) {
  const { t, lang } = useApp();

  return (
    <section className="relative isolate overflow-hidden border-b border-secondary-200 bg-gradient-to-b from-primary-50 via-white to-white text-primary-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 -z-10 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-12 sm:pt-16">
        <div className="max-w-3xl animate-slide-up">
          <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary-950 sm:text-5xl lg:text-6xl">
            {lang === 'ar' ? (
              <>
                أتقن <span className="text-primary-700">لغة جديدة</span> مع أفضل الأساتذة
              </>
            ) : lang === 'fr' ? (
              <>
                Trouvez votre <span className="text-primary-700">prof de langue</span> idéal
              </>
            ) : (
              <>
                Find your ideal <span className="text-primary-700">language tutor</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">{t('heroSubtitle')}</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="mt-6 max-w-3xl rounded-3xl border border-secondary-200 bg-white p-2 shadow-card transition duration-300 focus-within:border-primary-300 focus-within:shadow-card-hover sm:mt-8"
        >
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={filters.query}
              onChange={(event) => onChange({ query: event.target.value })}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-3 text-base text-primary-950 placeholder:text-slate-400 focus:outline-none"
            />
            <select
              aria-label={t('fieldCity')}
              className="hidden rounded-full bg-transparent px-3 py-3 text-sm font-medium text-slate-700 focus:outline-none sm:block"
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
            <Button type="submit" variant="accent" size="lg" className="shrink-0 px-5">
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{t('searchButton')}</span>
            </Button>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto border-t border-secondary-200 px-1 pb-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SUBJECTS.map((subject) => {
              const active = filters.subjectId === subject.id;
              return (
                <button
                  key={subject.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ subjectId: active ? null : subject.id })}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition duration-200 hover:-translate-y-0.5 ${active
                    ? 'border-primary-950 bg-primary-950 text-white shadow-sm'
                    : 'border-secondary-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-800'}`}
                >
                  <MessageSquare className={`h-3.5 w-3.5 ${active ? 'text-primary-500' : 'text-primary-700'}`} aria-hidden="true" />
                  <span className={`font-bold ${active ? 'text-primary-500' : 'text-primary-700'}`}>{subject.code}</span>
                  <span>{subject.native}</span>
                </button>
              );
            })}
          </div>
        </form>
      </div>
    </section>
  );
}
