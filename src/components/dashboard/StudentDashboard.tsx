import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Bookmark, Clock, CheckCircle2, Calendar, Search } from 'lucide-react';

export function StudentDashboard() {
  const { tutors, lang } = useApp();
  const savedTutors = tutors.slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Welcome Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] p-6 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold sm:text-3xl">مرحباً بك في مساحتك الخاصة! 👋</h1>
        <p className="mt-2 text-sm text-indigo-100">
          تابع حصصك القادمة، وتواصل مع أساتذتك المفضلين للدروس الخصوصية في المغرب.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <div className="flex items-center justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">أساتذة محفوظون</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{savedTutors.length}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-[#6366F1]">
            <Bookmark className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">طلبات معلّقة</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">حصص مؤكدة</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Upcoming Session Section */}
      <div className="mb-8 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#6366F1]" />
          الحصة القادمة
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#6366F1]/10 text-[#6366F1] font-bold flex items-center justify-center text-lg">
              FR
            </div>
            <div>
              <h3 className="font-bold text-slate-900">مراجعة اللغة الفرنسية - BAC</h3>
              <p className="text-xs text-slate-500">غداً في الساعة 18:00 (عن بُعد)</p>
            </div>
          </div>
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl px-4 py-2">
            دخول قاعة الدرس
          </Button>
        </div>
      </div>
    </div>
  );
}
