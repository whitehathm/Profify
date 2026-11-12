import { SearchX } from 'lucide-react';
import type { Tutor } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { TutorCard } from '@/components/discovery/TutorCard';

export function TutorGrid({ tutors }: { tutors: Tutor[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}

export function TutorGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-secondary-200 bg-white shadow-card">
          <div className="skeleton aspect-[4/3] w-full" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="skeleton h-4 w-24 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-2/3" />
            <div className="flex gap-2 pt-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
            <div className="skeleton mt-4 h-11 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center rounded-3xl border border-secondary-200 bg-white px-6 py-16 text-center shadow-card">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-100">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-primary-950">{t('emptyTitle')}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{t('emptyText')}</p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        {t('resetFilters')}
      </Button>
    </div>
  );
}
