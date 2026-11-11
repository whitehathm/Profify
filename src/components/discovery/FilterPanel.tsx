import type { ReactNode } from 'react';
import type { TutorFilters } from '@/types';
import { CITIES, SUBJECTS } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import { PRICE_MAX, PRICE_MIN, RATING_OPTIONS } from '@/lib/tutorFilters';
import { formatNumber } from '@/lib/format';

interface FilterPanelProps {
  filters: TutorFilters;
  onChange: (patch: Partial<TutorFilters>) => void;
  onReset: () => void;
}

function FilterGroup({ title, trailing, children }: { title: string; trailing?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-primary-950">{title}</h3>
        {trailing}
      </div>
      {children}
    </div>
  );
}

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const { t, lang } = useApp();

  return (
    <div className="space-y-7">
      <FilterGroup title={t('filterSubject')}>
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.subjectId === null} onClick={() => onChange({ subjectId: null })}>
            {t('allSubjects')}
          </Chip>
          {SUBJECTS.map((subject) => (
            <Chip key={subject.id} active={filters.subjectId === subject.id} onClick={() => onChange({ subjectId: subject.id })}>
              {subject.label[lang]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('filterCity')}>
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.cityId === null} onClick={() => onChange({ cityId: null })}>
            {t('allCities')}
          </Chip>
          {CITIES.map((city) => (
            <Chip key={city.id} active={filters.cityId === city.id} onClick={() => onChange({ cityId: city.id })}>
              {city.label[lang]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup
        title={t('filterPrice')}
        trailing={<span className="text-sm font-semibold text-primary-800">{t('upTo', { price: formatNumber(filters.maxPrice) })}</span>}
      >
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          value={filters.maxPrice}
          aria-label={t('filterPrice')}
          onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
          className="w-full accent-primary-700"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{PRICE_MIN}</span>
          <span>{PRICE_MAX}</span>
        </div>
      </FilterGroup>

      <FilterGroup title={t('filterRating')}>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((rating) => (
            <Chip key={rating} active={filters.minRating === rating} onClick={() => onChange({ minRating: rating })}>
              {rating === 0 ? t('anyRating') : `${rating.toFixed(1)}+`}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('filterMode')}>
        <Segmented
          label={t('filterMode')}
          value={filters.mode}
          onChange={(mode) => onChange({ mode })}
          options={[
            { value: 'all', label: t('modeAll') },
            { value: 'online', label: t('modeOnline') },
            { value: 'in_person', label: t('modeInPerson') },
          ]}
        />
      </FilterGroup>

      <Button variant="ghost" block onClick={onReset}>
        {t('resetFilters')}
      </Button>
    </div>
  );
}
