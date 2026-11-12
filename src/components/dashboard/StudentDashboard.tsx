import { useMemo, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CURRENT_STUDENT_ID, subjectLabel } from '@/data/catalog';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badges';
import { formatDate, formatNumber } from '@/lib/format';

export function StudentDashboard() {
  const { lang, t, user, bookings, savedIds, tutors, setBookingStatus, setRole, openModal } = useApp();
  const studentBookings = useMemo(
    () => bookings
      .filter((booking) => user ? booking.studentUserId === user.id : booking.studentId === CURRENT_STUDENT_ID)
      .sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time)),
    [bookings, user],
  );
  const savedTutors = tutors.filter((tutor) => savedIds.includes(tutor.id));
  const pendingCount = studentBookings.filter((booking) => booking.status === 'pending').length;
  const confirmedCount = studentBookings.filter((booking) => booking.status === 'accepted').length;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-950">{t('studentTitle')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('studentSubtitle')}</p>
        </div>
        <Button onClick={() => setRole('visitor')} icon={<ArrowIcon className="h-4 w-4" aria-hidden="true" />}>
          {t('browseTutors')}
        </Button>
      </header>

      <section aria-label={t('studentTitle')} className="grid gap-3 sm:grid-cols-3">
        <MetricCard icon={<Bookmark className="h-4 w-4 text-primary-600" aria-hidden="true" />} label={t('statSaved')} value={savedIds.length} />
        <MetricCard icon={<Clock className="h-4 w-4 text-warning-600" aria-hidden="true" />} label={t('statPending')} value={pendingCount} />
        <MetricCard icon={<CheckCircle2 className="h-4 w-4 text-success-600" aria-hidden="true" />} label={t('statConfirmed')} value={confirmedCount} />
      </section>

      <section className="space-y-4" aria-labelledby="student-bookings-heading">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary-600" aria-hidden="true" />
          <h2 id="student-bookings-heading" className="text-lg font-bold text-primary-950">{t('tabBookings')}</h2>
        </div>
        {studentBookings.length === 0 ? (
          <EmptyState title={t('bookingsEmptyTitle')} description={t('bookingsEmptyText')} />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {studentBookings.map((booking) => {
              const tutor = tutors.find((item) => item.id === booking.tutorId);
              return (
                <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {tutor && <Avatar src={tutor.avatar} name={tutor.name} size="md" />}
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-primary-950">{tutor?.name ?? booking.tutorId}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {tutor?.subjectIds[0] ? subjectLabel(tutor.subjectIds[0], lang) : t('bookTrial')}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    {t('sessionAt', { date: formatDate(booking.date, lang, { weekday: 'short', day: 'numeric', month: 'short' }), time: booking.time })}
                    {' · '}
                    {t(booking.mode === 'online' ? 'modeOnline' : 'modeInPerson')}
                  </p>
                  {booking.status === 'pending' && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBookingStatus(booking.id, 'cancelled')}
                      >
                        {t('cancelRequest')}
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="saved-tutors-heading">
        <h2 id="saved-tutors-heading" className="text-lg font-bold text-primary-950">{t('savedTutorsHeading')}</h2>
        {savedTutors.length === 0 ? (
          <EmptyState title={t('savedEmptyTitle')} description={t('savedEmptyText')} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedTutors.map((tutor) => (
              <button
                key={tutor.id}
                type="button"
                onClick={() => openModal({ type: 'profile', tutorId: tutor.id })}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-start transition hover:border-primary-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <Avatar src={tutor.avatar} name={tutor.name} size="md" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-primary-950">{tutor.name}</span>
                  <span className="mt-1 block line-clamp-2 text-sm text-slate-600">{tutor.headline[lang]}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-slate-600">
        <span className="text-sm font-medium">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-primary-950">{formatNumber(value)}</p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <p className="font-semibold text-primary-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}
