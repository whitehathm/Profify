import { Heart, MapPin } from 'lucide-react';
import type { Tutor } from '@/types';
import { cityLabel, subjectLabel } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { Avatar, RatingStars } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ModeTag, VerifiedBadge } from '@/components/ui/Badges';
import { formatNumber } from '@/lib/format';

export function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
  const { t, lang, savedIds, toggleSaved, openModal, notify } = useApp();
  const saved = savedIds.includes(tutor.id);

  return (
    <article
      className="group flex flex-col rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => openModal({ type: 'profile', tutorId: tutor.id })}
          aria-label={t('viewProfile')}
          className="rounded-2xl transition group-hover:scale-[1.03]"
        >
          <Avatar src={tutor.avatar} name={tutor.name} size="lg" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-bold text-primary-950">{tutor.name}</h3>
          </div>
          {tutor.verified && <div className="mt-1.5"><VerifiedBadge /></div>}
          <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-600">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{cityLabel(tutor.cityId, lang)}</span>
          </p>
        </div>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? t('removeFromSaved') : t('addToSaved')}
          onClick={() => {
            toggleSaved(tutor.id);
            notify(saved ? t('toastRemoved') : t('toastSaved'));
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-error-50"
        >
          <Heart className={`h-5 w-5 transition ${saved ? 'fill-error-500 text-error-500' : 'text-slate-400'}`} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <RatingStars rating={tutor.rating} count={tutor.reviewCount} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tutor.subjectIds.map((id) => (
          <span key={id} className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800">
            {subjectLabel(id, lang)}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tutor.modes.map((mode) => (
          <ModeTag key={mode} mode={mode} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-primary-900">{formatNumber(tutor.pricePerHour)}</span>
          <span className="text-sm text-slate-600">
            {t('currency')} {t('perHour')}
          </span>
        </p>
        <Button size="sm" onClick={() => openModal({ type: 'profile', tutorId: tutor.id })}>
          {t('viewProfile')}
        </Button>
      </div>
    </article>
  );
}
