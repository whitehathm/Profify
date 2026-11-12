import { MapPin, ShieldCheck, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function TrustMetricsBar() {
  const { t } = useApp();

  return (
    <section aria-label={t('trustVerified')} className="border-b border-secondary-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-secondary-200 px-2 sm:px-6">
        <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center sm:flex-row sm:gap-3 sm:py-4 sm:px-6 sm:text-start">
          <ShieldCheck className="h-5 w-5 shrink-0 text-success-700" aria-hidden="true" />
          <p className="text-xs font-semibold leading-tight text-primary-950 sm:text-sm">{t('trustVerified')}</p>
        </div>

        <div className="flex flex-col items-center gap-1 px-2 py-3 text-center sm:flex-row sm:gap-3 sm:py-4 sm:px-6 sm:text-start">
          <p className="flex items-center gap-1 text-sm font-extrabold text-primary-950 sm:text-base">
            4.9
            <Star className="h-4 w-4 fill-warning-500 text-warning-500" aria-hidden="true" />
          </p>
          <p className="text-xs font-medium leading-tight text-slate-600 sm:text-sm">{t('trustRating')}</p>
        </div>

        <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center sm:flex-row sm:gap-3 sm:py-4 sm:px-6 sm:text-start">
          <MapPin className="h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
          <p className="text-xs font-semibold leading-tight text-primary-950 sm:text-sm">{t('trustModes')}</p>
        </div>
      </div>
    </section>
  );
}
