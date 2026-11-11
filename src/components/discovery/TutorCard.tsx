import type { Tutor } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Star, ShieldCheck } from 'lucide-react';

interface TutorCardProps {
  tutor: Tutor;
  onBook?: (tutor: Tutor) => void;
}

export function TutorCard({ tutor, onBook }: TutorCardProps) {
  const { lang, setSelectedTutorForBooking } = useApp();

  const handleBook = () => {
    if (onBook) {
      onBook(tutor);
    } else {
      setSelectedTutorForBooking(tutor);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 transition-all hover:shadow-md hover:border-[#6366F1]/40">
      <div>
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-slate-100">
            <img src={tutor.avatarUrl} alt={tutor.name} className="h-full w-full object-cover" />
            {tutor.isVerified && (
              <span className="absolute bottom-0 right-0 rounded-full bg-[#6366F1] p-0.5 text-white ring-2 ring-white">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 truncate text-base group-hover:text-[#6366F1] transition-colors">
                {tutor.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{tutor.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
              {tutor.headline[lang] || tutor.headline.ar}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {tutor.bio[lang] || tutor.bio.ar}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="text-xs text-slate-400 block">سعر الحصة</span>
          <span className="text-lg font-extrabold text-slate-900">
            {tutor.hourlyRate} <span className="text-xs font-bold text-[#6366F1]">د.م / ساعة</span>
          </span>
        </div>

        <Button
          onClick={handleBook}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm border border-indigo-600"
        >
          احجز حصة تجريبية
        </Button>
      </div>
    </div>
  );
}
