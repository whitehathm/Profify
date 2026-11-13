import { Globe, ShieldCheck, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/format';

export function TrustMetricsBar() {
  const { tutors, t } = useApp();
  const verifiedCount = tutors.filter((tutor) => tutor.published && tutor.verified).length;
  const ratedTutors = tutors.filter((tutor) => tutor.published && tutor.reviewCount > 0);
  const averageRating = ratedTutors.length
    ? (ratedTutors.reduce((sum, tutor) => sum + tutor.rating, 0) / ratedTutors.length).toFixed(1)
    : '4.9';

  const items = [
    {
      icon: ShieldCheck,
      value: formatNumber(verifiedCount),
      label: t('trustVerified'),
    },
    {
      icon: Star,
      value: `${averageRating} / 5`,
      label: t('trustRating'),
    },
    {
      icon: Globe,
      value: formatNumber(6),
      label: t('trustModes'),
    },
  ];

  return (
    <section className="border-b border-secondary-200 bg-secondary-50/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-3 sm:gap-6 sm:px-6">
        {items.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2.5 ring-1 ring-secondary-200/80">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary-950">{value}</p>
              <p className="truncate text-xs text-slate-600">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
