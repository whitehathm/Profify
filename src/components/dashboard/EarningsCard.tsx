import { Wallet } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/format';

const FEE_RATE = 0.1;

interface EarningsCardProps {
  gross: number;
  sessions: number;
  pricePerHour: number;
}

export function EarningsCard({ gross, sessions, pricePerHour }: EarningsCardProps) {
  const { t } = useApp();
  const fee = Math.round(gross * FEE_RATE);
  const net = gross - fee;

  return (
    <div className="overflow-hidden rounded-2xl bg-primary-950 p-6 text-white shadow-card animate-slide-up">
      <div className="flex items-center gap-2 text-primary-200">
        <Wallet className="h-4 w-4" aria-hidden="true" />
        <h2 className="text-sm font-semibold">{t('earningsTitle')}</h2>
      </div>
      <p className="mt-1 text-sm text-primary-300">{t('earningsSubtitle')}</p>

      <div className="mt-6 space-y-3 text-sm">
        <Row label={`${t('grossLabel')} (${sessions} × ${formatNumber(pricePerHour)})`} value={`${formatNumber(gross)} ${t('currency')}`} />
        <Row label={t('feeLabel')} value={`- ${formatNumber(fee)} ${t('currency')}`} />
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-accent-300">{t('netLabel')}</span>
            <span className="text-2xl font-bold text-accent-300">
              {formatNumber(net)} {t('currency')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-primary-200">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
