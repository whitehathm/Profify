import { SlidersHorizontal } from 'lucide-react';
import type { SortOption, TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { inputClass } from '@/components/ui/Field';
import { SearchAutocomplete } from '@/components/discovery/SearchAutocomplete';
import { formatNumber } from '@/lib/format';

interface ResultsToolbarProps {
  filters: TutorFilters;
  onChange: (patch: Partial<TutorFilters>) => void;
  resultCount: number;
  activeCount: number;
  onOpenFilters: () => void;
}

export function ResultsToolbar({ filters, onChange, resultCount, activeCount, onOpenFilters }: ResultsToolbarProps) {
  const { t } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-primary-950">{t('tutorsHeading')}</h2>
          <p className="mt-1 text-sm text-slate-600" aria-live="polite">
            {t('tutorsFound', { count: formatNumber(resultCount) })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="tutor-sort">
            {t('sortBy')}
          </label>
          <select
            id="tutor-sort"
            className={`${inputClass} w-auto py-2.5 text-sm`}
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortOption })}
          >
            <option value="rating">{t('sortRating')}</option>
            <option value="price_asc">{t('sortPriceAsc')}</option>
            <option value="price_desc">{t('sortPriceDesc')}</option>
          </select>
          <span className="lg:hidden">
            <Button variant="outline" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={onOpenFilters}>
              {t('filtersButton')}
              {activeCount > 0 && (
                <span className="rounded-full bg-primary-50 px-1.5 text-xs font-bold text-primary-800 ring-1 ring-primary-200">{activeCount}</span>
              )}
            </Button>
          </span>
        </div>
      </div>
      <SearchAutocomplete
        value={filters.query}
        onChange={(query) => onChange({ query })}
        onPickSubject={(subjectId) => onChange({ subjectId, query: '' })}
      />
    </div>
  );
}
