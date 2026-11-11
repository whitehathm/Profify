import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Wallet, CalendarCheck, Star, Users, PlusCircle, Check, X, ArrowUpRight } from 'lucide-react';

export function TutorDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* 1. Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">لوحة الأستاذ</h1>
          <p className="text-xs text-slate-500 mt-1">نظرة عامة على نشاطك الحصص والأرباح</p>
        </div>
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm border border-indigo-600">
          <PlusCircle className="h-4 w-4" />
          إضافة حصة جديدة
        </Button>
      </div>

      {/* 2. Compact SaaS-style Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">أرباح الشهر</span>
            <Wallet className="h-4 w-4 text-[#6366F1]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">1,200</span>
            <span className="text-xs font-bold text-[#6366F1]">د.م</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">حصص أكملتها</span>
            <CalendarCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">12</span>
            <span className="text-xs text-slate-500">حصة</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الطلاب النشطون</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">8</span>
            <span className="text-xs text-slate-500">طالب</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">التقييم</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">4.9</span>
            <span className="text-xs text-slate-400">/ 5</span>
          </div>
        </div>
      </div>

      {/* 3. Clean Actionable Section: Booking Requests */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900">طلبات الحجز الجديدة</h2>
          <span className="text-xs font-semibold bg-indigo-50 text-[#6366F1] px-2.5 py-0.5 rounded-full">1 طلب جديد</span>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                أ.م
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">أمين مرابط</h3>
                <p className="text-xs text-slate-500">طلب درس تجريبي: اللغة الإنجليزية (A1)</p>
              </div>
            </div>

            {/* Clear contrast Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm">
                <Check className="h-3.5 w-3.5" />
                قبول الطلب
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2 rounded-xl transition">
                <X className="h-3.5 w-3.5" />
                رفض
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
