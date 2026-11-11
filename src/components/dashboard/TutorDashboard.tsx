import { useMemo } from 'react';
import { CalendarCheck, Star, Wallet } from 'lucide-react';
import { CURRENT_TUTOR_ID } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { EarningsCard } from '@/components/dashboard/EarningsCard';
import { RequestsCard } from '@/components/dashboard/RequestsCard';
import { ListingManager } from '@/components/dashboard/ListingManager';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/format';

export function TutorDashboard() {
  const { t, tutors, bookings, setRole } = useApp();
  const tutor = tutors.find((item) => item.id === CURRENT_TUTOR_ID);

  const acceptedSessions = useMemo(
    () => bookings.filter((booking) => booking.tutorId === CURRENT_TUTOR_ID && booking.status === 'accepted'),
    [bookings],
  );
  const pendingRequests = useMemo(
    () => bookings.filter((booking) => booking.tutorId === CURRENT_TUTOR_ID && booking.status === 'pending'),
    [bookings],
  );

  if (!tutor) return null;

  const gross = acceptedSessions.length * tutor.pricePerHour;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">{t('tutorTitle')}</h1>
          <p className="mt-1.5 text-sm text-slate-600">{t('tutorSubtitle')}</p>
        </div>
        <Button variant="outline" onClick={() => setRole('visitor')}>
          {t('browseTutors')}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Wallet className="h-5 w-5" />} label={t('statEarnings')} value={`${formatNumber(gross)} ${t('currency')}`} tone="accent" />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label={t('statSessions')} value={formatNumber(acceptedSessions.length)} tone="success" />
        <StatCard icon={<Star className="h-5 w-5" />} label={t('statRating')} value={tutor.rating.toFixed(1)} tone="primary" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <EarningsCard gross={gross} sessions={acceptedSessions.length} pricePerHour={tutor.pricePerHour} />
          <RequestsCard requests={pendingRequests} />
        </div>
        <ListingManager tutor={tutor} />
      </div>
    </section>
  );
}
