import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Wallet, CalendarCheck, Star, Users, PlusCircle } from 'lucide-react';

export function TutorDashboard() {
  const { user } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#0F172A] p-6 text-white shadow-sm border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">لوحة تحكم الأستاذ 👨‍🏫</h1>
          <p className="mt-1 text-xs text-slate-400">
            إدارة حصصك، متابعة طلبات الطلاب، وعرض أرباحك بالدرهم المغربي.
          </p>
        </div>
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 border border-indigo-500">
          <PlusCircle className="h-4 w-4" />
          إضافة حصة جديدة
        </Button>
      </div>

      {/* Financial & Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">أرباح الشهر</span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-[#6366F1]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">1,200 <span className="text-xs text-[#6366F1]">د.م</span></p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">حصص مدرّسة</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">12 <span className="text-xs text-slate-400">حصة</span></p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">الطلاب النشطون</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">8 <span className="text-xs text-slate-400">طلاب</span></p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">التقييم العام</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-500">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">4.9 <span className="text-xs text-slate-400">/ 5</span></p>
        </div>
      </div>

      {/* Booking Requests */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">طلبات الحجز الجديدة</h2>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
              أ.م
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">أمين مرابط</h3>
              <p className="text-xs text-slate-500">طلب درس تجريبي: اللغة الإنجليزية (A1)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button className="bg-[#6366F1] text-white text-xs font-bold rounded-xl px-4 py-2 flex-1 sm:flex-none">
              قبول الطلب
            </Button>
            <Button className="bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl px-4 py-2 flex-1 sm:flex-none">
              رفض
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
