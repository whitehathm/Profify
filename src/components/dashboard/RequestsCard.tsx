import { Inbox } from 'lucide-react';
import type { Booking } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ModeTag } from '@/components/ui/Badges';
import { formatDate } from '@/lib/format';

interface RequestsCardProps {
  requests: Booking[];
}

export function RequestsCard({ requests }: RequestsCardProps) {
  const { t, lang, setBookingStatus, notify } = useApp();

  const respond = (id: string, status: 'accepted' | 'declined') => {
    setBookingStatus(id, status);
    notify(t(status === 'accepted' ? 'toastAccepted' : 'toastDeclined'));
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
      <h2 className="text-lg font-bold text-primary-950">{t('requestsTitle')}</h2>

      {requests.length === 0 ? (
        <div className="mt-6 flex flex-col items-center py-8 text-center animate-fade-in">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Inbox className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm text-slate-600">{t('requestsEmpty')}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {requests.map((request) => (
            <li key={request.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-primary-950">{request.studentName}</p>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {t('sessionAt', {
                      date: formatDate(request.date, lang, { weekday: 'short', day: 'numeric', month: 'short' }),
                      time: request.time,
                    })}
                  </p>
                  <div className="mt-2">
                    <ModeTag mode={request.mode} />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => respond(request.id, 'declined')}>
                  {t('decline')}
                </Button>
                <Button variant="accent" size="sm" onClick={() => respond(request.id, 'accepted')}>
                  {t('accept')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
