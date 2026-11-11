import { useState } from 'react';
import { Bookmark, CalendarClock, CheckCircle2, Clock } from 'lucide-react';
import type { Booking, BookingStatus, Tutor } from '@/types';
import { CURRENT_STUDENT_ID, cityLabel, subjectLabel } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ModeTag, StatusBadge } from '@/components/ui/Badges';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatDate, formatNumber } from '@/lib/format';

type StudentTab = 'saved' | 'bookings';

export function StudentDashboard() {
  const { t, lang, user, tutors, savedIds, toggleSaved, bookings, setBookingStatus, setRole, openModal, notify } = useApp();
  const [tab, setTab] = useState<StudentTab>('saved');

  const savedTutors = tutors.filter((tutor) => savedIds.includes(tutor.id));
  const myBookings = bookings.filter((booking) => booking.studentId === CURRENT_STUDENT_ID);
  const countByStatus = (status: BookingStatus) => myBookings.filter((booking) => booking.status === status).length;

  const cancelBooking = (id: string) => {
    setBookingStatus(id, 'cancelled');
    notify(t('toastCancelled'));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">{t('studentTitle')}</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {t('greeting', { name: user?.name ?? t('guestStudent') })} · {t('studentSubtitle')}
          </p>
        </div>
        <Button variant="outline" onClick={() => setRole('visitor')}>
          {t('browseTutors')}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Bookmark className="h-5 w-5" />} label={t('statSaved')} value={formatNumber(savedIds.length)} tone="primary" />
        <StatCard icon={<Clock className="h-5 w-5" />} label={t('statPending')} value={formatNumber(countByStatus('pending'))} tone="warning" />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label={t('statConfirmed')}
          value={formatNumber(countByStatus('accepted'))}
          tone="success"
        />
      </div>

      <div className="mt-8 flex gap-2" role="tablist">
        <Chip active={tab === 'saved'} onClick={() => setTab('saved')}>
          {t('tabSaved')} ({savedTutors.length})
        </Chip>
        <Chip active={tab === 'bookings'} onClick={() => setTab('bookings')}>
          {t('tabBookings')} ({myBookings.length})
        </Chip>
      </div>

      <div className="mt-5">
        {tab === 'saved' ? (
          savedTutors.length === 0 ? (
            <EmptyPanel title={t('savedEmptyTitle')} text={t('savedEmptyText')} actionLabel={t('browseTutors')} onAction={() => setRole('visitor')} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {savedTutors.map((tutor) => (
                <li key={tutor.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-slate-200/70 animate-fade-in">
                  <Avatar src={tutor.avatar} name={tutor.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-primary-950">{tutor.name}</p>
                    <p className="truncate text-sm text-slate-600">
                      {subjectLabel(tutor.subjectIds[0], lang)} · {cityLabel(tutor.cityId, lang)}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-primary-800">
                      {tutor.pricePerHour} {t('currency')} {t('perHour')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => openModal({ type: 'book', tutorId: tutor.id })}>
                      {t('bookSession')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        toggleSaved(tutor.id);
                        notify(t('toastRemoved'));
                      }}
                    >
                      {t('removeFromSaved')}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : myBookings.length === 0 ? (
          <EmptyPanel title={t('bookingsEmptyTitle')} text={t('bookingsEmptyText')} actionLabel={t('browseTutors')} onAction={() => setRole('visitor')} />
        ) : (
          <ul className="space-y-3">
            {myBookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                tutor={tutors.find((item) => item.id === booking.tutorId)}
                onCancel={() => cancelBooking(booking.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function BookingRow({ booking, tutor, onCancel }: { booking: Booking; tutor: Tutor | undefined; onCancel: () => void }) {
  const { t, lang } = useApp();
  const cancellable = booking.status === 'pending' || booking.status === 'accepted';

  return (
    <li className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 animate-fade-in sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-primary-950">{tutor?.name ?? '-'}</p>
          <p className="text-sm text-slate-600">
            {t('sessionAt', {
              date: formatDate(booking.date, lang, { weekday: 'short', day: 'numeric', month: 'short' }),
              time: booking.time,
            })}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ModeTag mode={booking.mode} />
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </div>
      {cancellable && (
        <Button variant="outline" size="sm" onClick={onCancel}>
          {t('cancelRequest')}
        </Button>
      )}
    </li>
  );
}

function EmptyPanel({ title, text, actionLabel, onAction }: { title: string; text: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-slate-200/70 animate-fade-in">
      <h2 className="text-lg font-bold text-primary-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{text}</p>
      <Button className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
