import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { X, Video, MapPin, CheckCircle2 } from 'lucide-react';

export function BookingModal() {
  const { selectedTutorForBooking, setSelectedTutorForBooking, lang } = useApp();
  const [isSuccess, setIsSuccess] = useState(false);

  if (!selectedTutorForBooking) return null;

  const labels = {
    ar: {
      title: 'حجز حصة تجريبية',
      method: 'طريقة الدرس:',
      online: 'عن بُعد (Online)',
      inPerson: 'حضوري',
      confirmBtn: 'تأكيد الحجز المباشر',
      successTitle: 'تم إرسال طلب الحجز بنجاح!',
      successDesc: 'سيتم إشعار الأستاذ وتأكيد الموعد معك.',
    },
    fr: {
      title: 'Réserver un cours d\'essai',
      method: 'Mode de cours :',
      online: 'En ligne',
      inPerson: 'En présence',
      confirmBtn: 'Confirmer la réservation',
      successTitle: 'Demande envoyée !',
      successDesc: 'L\'enseignant sera notifié.',
    },
    en: {
      title: 'Book a Trial Lesson',
      method: 'Lesson Mode:',
      online: 'Online',
      inPerson: 'In-Person',
      confirmBtn: 'Confirm Booking',
      successTitle: 'Booking Request Sent!',
      successDesc: 'The tutor will be notified.',
    },
  }[lang || 'ar'];

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedTutorForBooking(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <button
          onClick={() => setSelectedTutorForBooking(null)}
          className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 rounded-lg p-1"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {labels.title}
            </h2>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <img
                src={selectedTutorForBooking.avatarUrl}
                alt={selectedTutorForBooking.name}
                className="h-12 w-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedTutorForBooking.name}</h3>
                <p className="text-xs text-[#6366F1] font-extrabold">
                  {selectedTutorForBooking.hourlyRate} د.م / ساعة
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">{labels.method}</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#6366F1] bg-indigo-50/50 p-3 text-xs font-bold text-[#6366F1]">
                  <Video className="h-4 w-4" />
                  <span>{labels.online}</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-600 opacity-60">
                  <MapPin className="h-4 w-4" />
                  <span>{labels.inPerson}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl py-3 shadow-sm"
            >
              {labels.confirmBtn}
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{labels.successTitle}</h3>
            <p className="text-xs text-slate-500">{labels.successDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
