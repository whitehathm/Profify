import { Star } from 'lucide-react';
import { CITIES, SUBJECTS } from '@/data/catalog';
import type { TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { inputClass } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { formatNumber } from '@/lib/format';
import { PRICE_MAX, PRICE_MIN, RATING_OPTIONS, countActiveFilters } from '@/lib/tutorFilters';

interface FilterPanelProps {
  filters: TutorFilters;
  onChange: (patch: Partial<TutorFilters>) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const { lang, t } = useApp();
  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="filter-subject" className="mb-2 block text-sm font-semibold text-primary-950">
          {t('filterSubject')}
        </label>
        <select
          id="filter-subject"
          className={inputClass}
          value={filters.subjectId ?? ''}
          onChange={(event) => onChange({ subjectId: event.target.value || null })}
        >
          <option value="">{t('allSubjects')}</option>
          {SUBJECTS.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label[lang]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-city" className="mb-2 block text-sm font-semibold text-primary-950">
          {t('filterCity')}
        </label>
        <select
          id="filter-city"
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
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-primary-950">{t('filterMode')}</span>
        <Segmented
          compact
          label={t('filterMode')}
          value={filters.mode}
          onChange={(mode) => onChange({ mode })}
          options={[
            { value: 'all', label: t('modeAll') },
            { value: 'online', label: t('modeOnline') },
            { value: 'in_person', label: t('modeInPerson') },
          ]}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <label htmlFor="filter-price" className="text-sm font-semibold text-primary-950">
            {t('filterPrice')}
          </label>
          <span className="text-xs font-semibold text-primary-700">
            {t('upTo', { price: formatNumber(filters.maxPrice) })}
          </span>
        </div>
        <input
          id="filter-price"
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          value={filters.maxPrice}
          onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
          className="h-2 w-full cursor-pointer accent-primary-500"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{formatNumber(PRICE_MIN)} {t('currency')}</span>
          <span>{formatNumber(PRICE_MAX)} {t('currency')}</span>
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-primary-950">{t('filterRating')}</span>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((rating) => (
            <Chip
              key={rating}
              active={filters.minRating === rating}
              onClick={() => onChange({ minRating: rating })}
            >
              {rating === 0 ? (
                t('anyRating')
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning-500 text-warning-500" aria-hidden="true" />
                  <span>{rating}+</span>
                </span>
              )}
            </Chip>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <Button variant="ghost" block onClick={onReset}>
          {t('resetFilters')}
        </Button>
      )}
    </div>
  );
}
