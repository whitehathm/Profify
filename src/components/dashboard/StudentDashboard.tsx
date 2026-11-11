import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Bookmark, Clock, CheckCircle2, Calendar, Video, ArrowRight, ArrowLeft } from 'lucide-react';

export function StudentDashboard() {
  const { lang } = useApp();

  const labels = {
    ar: {
      title: 'مساحتي الخاصة',
      subtitle: 'متابعة الحصص القادمة، الطلبات والمعلمين المحفوظين',
      exploreBtn: 'استكشاف الأساتذة',
      savedTutors: 'أساتذة محفوظون',
      pendingRequests: 'طلبات معلقة',
      confirmedLessons: 'حصص مؤكدة',
      tutorsCount: 'أستاذ',
      requestsCount: 'طلب',
      lessonsCount: 'حصة',
      upcomingTitle: 'الحصة القادمة',
      upcomingSubject: 'مراجعة اللغة الفرنسية - BAC',
      upcomingTime: 'غداً في الساعة 18:00 (عن بُعد)',
      joinClass: 'دخول قاعة الدرس',
      savedSectionTitle: 'الأساتذة المحفوظون مؤخراً',
      noSaved: 'لا يوجد أساتذة محفوظون حالياً',
    },
    fr: {
      title: 'Mon Espace',
      subtitle: 'Suivez vos prochains cours, demandes et professeurs enregistrés',
      exploreBtn: 'Explorer les professeurs',
      savedTutors: 'Professeurs enregistrés',
      pendingRequests: 'Demandes en attente',
      confirmedLessons: 'Cours confirmés',
      tutorsCount: 'profs',
      requestsCount: 'demande',
      lessonsCount: 'cours',
      upcomingTitle: 'Prochain Cours',
      upcomingSubject: 'Révision de Français - BAC',
      upcomingTime: 'Demain à 18:00 (En ligne)',
      joinClass: 'Rejoindre la classe',
      savedSectionTitle: 'Professeurs récents enregistrés',
      noSaved: 'Aucun professeur enregistré pour le moment',
    },
    en: {
      title: 'My Workspace',
      subtitle: 'Track your upcoming lessons, requests, and saved tutors',
      exploreBtn: 'Explore Tutors',
      savedTutors: 'Saved Tutors',
      pendingRequests: 'Pending Requests',
      confirmedLessons: 'Confirmed Lessons',
      tutorsCount: 'tutors',
      requestsCount: 'request',
      lessonsCount: 'lessons',
      upcomingTitle: 'Upcoming Lesson',
      upcomingSubject: 'French Revision - BAC Prep',
      upcomingTime: 'Tomorrow at 18:00 (Online)',
      joinClass: 'Join Classroom',
      savedSectionTitle: 'Recently Saved Tutors',
      noSaved: 'No saved tutors at the moment',
    },
  }[lang || 'ar'];

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* 1. Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{labels.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{labels.subtitle}</p>
        </div>
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm border border-indigo-600">
          <span>{labels.exploreBtn}</span>
          <ArrowIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* 2. Compact Stats Grid (Matching Tutor Dashboard Style) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{labels.savedTutors}</span>
            <Bookmark className="h-4 w-4 text-[#6366F1]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">2</span>
            <span className="text-xs text-slate-500">{labels.tutorsCount}</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{labels.pendingRequests}</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">1</span>
            <span className="text-xs text-slate-500">{labels.requestsCount}</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{labels.confirmedLessons}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">1</span>
            <span className="text-xs text-slate-500">{labels.lessonsCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Actionable Upcoming Lesson Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#6366F1]" />
            {labels.upcomingTitle}
          </h2>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full">
            مؤكدة
          </span>
        </div>

        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-50 text-[#6366F1] font-bold flex items-center justify-center text-xs border border-indigo-100">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{labels.upcomingSubject}</h3>
              <p className="text-xs text-slate-500">{labels.upcomingTime}</p>
            </div>
          </div>

          <button className="flex items-center justify-center gap-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm w-full sm:w-auto">
            {labels.joinClass}
          </button>
        </div>
      </div>
    </div>
  );
}
