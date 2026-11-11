import { SearchX } from 'lucide-react';
import type { Tutor } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { TutorCard } from '@/components/discovery/TutorCard';

export function TutorGrid({ tutors }: { tutors: Tutor[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {tutors.map((tutor, index) => (
        <TutorCard key={tutor.id} tutor={tutor} index={index} />
      ))}
    </div>
  );
}

export function TutorGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
          <div className="flex items-start gap-4">
            <div className="skeleton h-16 w-16 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <div className="skeleton h-6 w-20" />
            <div className="skeleton h-6 w-16" />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="skeleton h-6 w-24" />
            <div className="skeleton h-8 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-200/70 animate-fade-in">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
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
