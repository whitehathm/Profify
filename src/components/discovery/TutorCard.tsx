import { CalendarDays, Heart, MapPin, Monitor, Users } from 'lucide-react';
import type { Tutor } from '@/types';
import { cityLabel, subjectLabel } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { Avatar, RatingStars } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/Badges';
import { formatNumber } from '@/lib/format';

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const { t, lang, savedIds, toggleSaved, openModal, notify } = useApp();
  const saved = savedIds.includes(tutor.id);
  const openProfile = () => openModal({ type: 'profile', tutorId: tutor.id });

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-secondary-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card-hover"
    >
      <div className="relative">
        <button
          type="button"
          onClick={openProfile}
          aria-label={`${t('viewProfile')}: ${tutor.name}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-primary-50 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
        >
          {tutor.avatar ? (
            <img
              src={tutor.avatar}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-50">
              <Avatar name={tutor.name} size="xl" className="rounded-full" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-950/90 via-primary-950/35 to-transparent px-4 pb-4 pt-14 text-white sm:px-5">
            <h3 className="truncate text-lg font-bold leading-tight sm:text-xl">{tutor.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-white/90 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {cityLabel(tutor.cityId, lang)}
              </span>
              {tutor.modes.map((mode) => {
                const Icon = mode === 'online' ? Monitor : Users;
                return (
                  <span key={mode} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {t(mode === 'online' ? 'modeOnline' : 'modeInPerson')}
                  </span>
                );
              })}
            </div>
          </div>
        </button>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? t('removeFromSaved') : t('addToSaved')}
          onClick={() => {
            toggleSaved(tutor.id);
            notify(saved ? t('toastRemoved') : t('toastSaved'));
          }}
          className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm ring-1 ring-primary-950/5 transition hover:bg-primary-50 hover:text-primary-600"
        >
          <Heart className={`h-5 w-5 ${saved ? 'fill-error-500 text-error-500' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {tutor.reviewCount > 0 || tutor.verified ? (
            <RatingStars rating={tutor.rating} count={tutor.reviewCount > 0 ? tutor.reviewCount : undefined} />
          ) : (
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800">{t('newTutor')}</span>
          )}
          {tutor.verified && <VerifiedBadge />}
        </div>

        <p className="mt-3 text-sm font-semibold leading-snug text-primary-950 sm:text-base">{tutor.headline[lang]}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{tutor.bio[lang]}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tutor.subjectIds.map((id) => (
            <span key={id} className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800">
              {subjectLabel(id, lang)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-secondary-200 pt-4">
          <p className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-2xl font-extrabold tracking-tight text-primary-950">{formatNumber(tutor.pricePerHour)}</span>
            <span className="text-sm font-medium text-slate-600">{t('currency')} {t('perHour')}</span>
          </p>
          <span className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">{t('bookTrial')}</span>
        </div>

        <Button
          size="md"
          className="mt-4 w-full"
          icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
          onClick={() => openModal({ type: 'book', tutorId: tutor.id })}
        >
          {t('bookSession')}
        </Button>
      </div>
    </article>
  );
}
