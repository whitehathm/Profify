import { useMemo } from 'react';
import { CalendarCheck, Check, Star, Users, Wallet, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CURRENT_TUTOR_ID, subjectLabel } from '@/data/catalog';
import { StatusBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatDate, formatNumber, initials } from '@/lib/format';

export function TutorDashboard() {
  const { lang, t, user, bookings, tutors, setBookingStatus } = useApp();
  const tutor = (user && tutors.find((item) => item.ownerId === user.id))
    ?? tutors.find((item) => item.id === CURRENT_TUTOR_ID);
  const activeTutorId = tutor?.id ?? CURRENT_TUTOR_ID;
  const tutorBookings = useMemo(
    () => bookings
      .filter((booking) => booking.tutorId === activeTutorId)
      .sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time)),
    [bookings, activeTutorId],
  );
  const visibleBookings = tutorBookings.filter((booking) => booking.status === 'pending' || booking.status === 'accepted');
  const confirmedBookings = tutorBookings.filter((booking) => booking.status === 'accepted');
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const monthlyEarnings =
    confirmedBookings.filter((booking) => booking.date.startsWith(currentMonth)).length * (tutor?.pricePerHour ?? 0);
  const activeStudents = new Set(confirmedBookings.map((booking) => booking.studentId)).size;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-primary-950">{t('tutorTitle')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('tutorSubtitle')}</p>
      </header>

      <section aria-label={t('tutorTitle')} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Wallet className="h-5 w-5" aria-hidden="true" />}
          label={t('statEarnings')}
          value={`${formatNumber(monthlyEarnings)} ${t('currency')}`}
          tone="primary"
        />
        <StatCard
          icon={<CalendarCheck className="h-5 w-5" aria-hidden="true" />}
          label={t('confirmedSessions')}
          value={formatNumber(confirmedBookings.length)}
          tone="success"
        />
        <StatCard
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          label={t('activeStudents')}
          value={formatNumber(activeStudents)}
          tone="accent"
        />
        <StatCard
          icon={<Star className="h-5 w-5 fill-current" aria-hidden="true" />}
          label={t('statRating')}
          value={`${(tutor?.rating ?? 0).toFixed(1)} / 5`}
          tone="warning"
        />
      </section>

      <section className="space-y-4" aria-labelledby="tutor-bookings-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="tutor-bookings-heading" className="text-lg font-bold text-primary-950">{t('requestsTitle')}</h2>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {t('newRequestsCount', { count: tutorBookings.filter((booking) => booking.status === 'pending').length })}
          </span>
        </div>

        {visibleBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="font-semibold text-primary-950">{t('requestsEmpty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleBookings.map((booking) => {
              const subject = tutor?.subjectIds[0] ? subjectLabel(tutor.subjectIds[0], lang) : t('bookTrial');
              return (
                <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-primary-700">
                        {initials(booking.studentName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-primary-950">{booking.studentName}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{subject}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {t('sessionAt', { date: formatDate(booking.date, lang, { weekday: 'short', day: 'numeric', month: 'short' }), time: booking.time })}
                          {' · '}
                          {t(booking.mode === 'online' ? 'modeOnline' : 'modeInPerson')}
                        </p>
                      </div>
                    </div>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 sm:shrink-0">
                        <Button
                          size="sm"
                          onClick={() => setBookingStatus(booking.id, 'accepted')}
                          icon={<Check className="h-4 w-4" aria-hidden="true" />}
                        >
                          {t('accept')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setBookingStatus(booking.id, 'declined')}
                          icon={<X className="h-4 w-4" aria-hidden="true" />}
                        >
                          {t('decline')}
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
