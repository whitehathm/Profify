import { CalendarDays, Heart, MapPin } from 'lucide-react';
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
  const openProfile = () => openModal({ type: 'profile', tutorId: tutor.id });

  return (
    <article
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-card-hover animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={openProfile}
          aria-label={`${t('viewProfile')}: ${tutor.name}`}
          className="shrink-0 rounded-2xl transition group-hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <Avatar src={tutor.avatar} name={tutor.name} size="lg" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-primary-950">
            <button
              type="button"
              onClick={openProfile}
              className="text-start transition hover:text-primary-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {tutor.name}
            </button>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-primary-700">{tutor.headline[lang]}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {tutor.verified && <VerifiedBadge />}
            <p className="flex min-w-0 items-center gap-1 text-sm text-slate-600">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{cityLabel(tutor.cityId, lang)}</span>
            </p>
          </div>
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

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{tutor.bio[lang]}</p>

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
        <Button
          size="sm"
          icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
          onClick={() => openModal({ type: 'book', tutorId: tutor.id })}
        >
          {t('bookTrial')}
        </Button>
      </div>
    </article>
  );
}
