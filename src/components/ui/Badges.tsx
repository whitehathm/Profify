import { BadgeCheck, Monitor, Users } from 'lucide-react';
import type { BookingStatus, TeachingMode } from '@/types';
import { useApp } from '@/context/AppContext';

export function ModeTag({ mode }: { mode: TeachingMode }) {
  const { t } = useApp();
  const Icon = mode === 'online' ? Monitor : Users;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800 ring-1 ring-primary-100">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {t(mode === 'online' ? 'modeOnline' : 'modeInPerson')}
    </span>
  );
}

export function VerifiedBadge() {
  const { t } = useApp();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-700 ring-1 ring-success-100">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
      {t('verifiedBadge')}
    </span>
  );
}

const STATUS_STYLES: Record<BookingStatus, { label: 'statusPending' | 'statusAccepted' | 'statusDeclined' | 'statusCancelled'; className: string }> = {
  pending: { label: 'statusPending', className: 'bg-primary-50 text-primary-800 ring-primary-100' },
  accepted: { label: 'statusAccepted', className: 'bg-success-50 text-success-700 ring-success-100' },
  declined: { label: 'statusDeclined', className: 'bg-error-50 text-error-700 ring-error-100' },
  cancelled: { label: 'statusCancelled', className: 'bg-slate-100 text-slate-600 ring-slate-200' },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useApp();
  const style = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${style.className}`}>
      {t(style.label)}
    </span>
  );
}
