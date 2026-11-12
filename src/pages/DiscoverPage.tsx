import { useCallback, useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { HeroSearch } from '@/components/discovery/HeroSearch';
import { ResultsToolbar } from '@/components/discovery/ResultsToolbar';
import { FilterPanel } from '@/components/discovery/FilterPanel';
import { EmptyState, TutorGrid, TutorGridSkeleton } from '@/components/discovery/TutorGrid';
import { DEFAULT_FILTERS, countActiveFilters, filterTutors } from '@/lib/tutorFilters';
import { formatNumber } from '@/lib/format';

const LOAD_DELAY_MS = 800;

export function DiscoverPage() {
  const { tutors, lang, t } = useApp();
  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const results = useMemo(() => filterTutors(tutors, filters, lang), [tutors, filters, lang]);
  const patch = useCallback((changes: Partial<TutorFilters>) => setFilters((previous) => ({ ...previous, ...changes })), []);
  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const activeCount = countActiveFilters(filters);

  const scrollToResults = () => {
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filterPanel = <FilterPanel filters={filters} onChange={patch} onReset={reset} />;

  return (
    <div className="min-h-screen bg-white text-primary-950">
      <HeroSearch filters={filters} onChange={patch} onSearch={scrollToResults} />

      <section id="results" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10 sm:px-6 lg:flex lg:gap-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 rounded-3xl border border-secondary-200 bg-white p-6 shadow-card">
            <div className="mb-6 flex items-center gap-2 text-primary-950">
              <SlidersHorizontal className="h-4 w-4 text-primary-500" aria-hidden="true" />
              <h2 className="text-lg font-bold">{t('filtersTitle')}</h2>
            </div>
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <ResultsToolbar
            filters={filters}
            onChange={patch}
            resultCount={results.length}
            activeCount={activeCount}
            onOpenFilters={() => setDrawerOpen(true)}
          />
          {loading ? (
            <TutorGridSkeleton />
          ) : results.length === 0 ? (
            <EmptyState onReset={reset} />
          ) : (
            <TutorGrid tutors={results} />
          )}
        </div>
      </section>

      {drawerOpen && (
        <Modal
          title={t('filtersTitle')}
          onClose={() => setDrawerOpen(false)}
          footer={
            <Button variant="accent" block onClick={() => setDrawerOpen(false)}>
              {t('showResults', { count: formatNumber(results.length) })}
            </Button>
          }
        >
          {filterPanel}
        </Modal>
      )}
    </div>
  );
}
