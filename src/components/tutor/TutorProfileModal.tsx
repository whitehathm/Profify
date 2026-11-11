import { useState } from 'react';
import { CalendarDays, Heart, Phone } from 'lucide-react';
import { cityLabel, subjectLabel } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { Avatar, RatingStars } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ModeTag, VerifiedBadge } from '@/components/ui/Badges';
import { AvailabilityCalendar } from '@/components/tutor/AvailabilityCalendar';
import { formatDate } from '@/lib/format';

export function TutorProfileModal({ tutorId }: { tutorId: string }) {
  const { tutors, lang, t, openModal, closeModal, savedIds, toggleSaved, notify } = useApp();
  const tutor = tutors.find((item) => item.id === tutorId);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  if (!tutor) return null;

  const saved = savedIds.includes(tutor.id);

  return (
    <Modal
      title={tutor.name}
      onClose={closeModal}
      size="lg"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" icon={<Phone className="h-4 w-4" />} onClick={() => openModal({ type: 'contact', tutorId: tutor.id })}>
            {t('contactTutor')}
          </Button>
          <Button
            icon={<CalendarDays className="h-4 w-4" />}
            onClick={() =>
              openModal({
                type: 'book',
                tutorId: tutor.id,
                date: date ?? undefined,
                time: time ?? undefined,
              })
            }
          >
            {t('bookSession')}
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <Avatar src={tutor.avatar} name={tutor.name} size="xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {tutor.verified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-slate-600">{cityLabel(tutor.cityId, lang)}</p>
            <div className="flex flex-wrap items-center gap-3">
              <RatingStars rating={tutor.rating} count={tutor.reviewCount} />
              <span className="text-sm text-slate-600">{t('experience', { years: tutor.experienceYears })}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-lg font-bold text-primary-900">
                {tutor.pricePerHour} {t('currency')} <span className="text-sm font-medium text-slate-600">{t('perHour')}</span>
              </span>
              <button
                type="button"
                aria-pressed={saved}
                onClick={() => {
                  toggleSaved(tutor.id);
                  notify(saved ? t('toastRemoved') : t('toastSaved'));
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-error-200 hover:bg-error-50"
              >
                <Heart className={`h-4 w-4 ${saved ? 'fill-error-500 text-error-500' : ''}`} aria-hidden="true" />
                {saved ? t('removeFromSaved') : t('addToSaved')}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tutor.subjectIds.map((id) => (
                <span key={id} className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800">
                  {subjectLabel(id, lang)}
                </span>
              ))}
              {tutor.modes.map((mode) => (
                <ModeTag key={mode} mode={mode} />
              ))}
            </div>
          </div>
        </div>

        <section>
          <h3 className="mb-2 text-base font-bold text-primary-950">{t('aboutTitle')}</h3>
          <p className="text-sm leading-relaxed text-slate-700">{tutor.bio[lang]}</p>
        </section>

        <section>
          <h3 className="mb-3 text-base font-bold text-primary-950">{t('qualificationsTitle')}</h3>
          <ul className="space-y-2">
            {tutor.qualifications.map((qualification) => (
              <li key={qualification[lang]} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                {qualification[lang]}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-base font-bold text-primary-950">{t('availabilityTitle')}</h3>
          <AvailabilityCalendar
            tutor={tutor}
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />
          {date && time && (
            <p className="mt-3 text-sm font-medium text-success-700">
              {formatDate(date, lang, { weekday: 'long', day: 'numeric', month: 'long' })} · {time}
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-base font-bold text-primary-950">{t('reviewsTitle')}</h3>
          {tutor.reviews.length === 0 ? (
            <p className="text-sm text-slate-600">{t('noReviews')}</p>
          ) : (
            <ul className="space-y-3">
              {tutor.reviews.map((review) => (
                <li key={review.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-primary-950">{review.author}</span>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.comment[lang]}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Modal>
  );
}
