import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { DemoBar } from '@/components/layout/DemoBar';
import { Footer } from '@/components/layout/Footer';
import { ModalHost } from '@/components/layout/ModalHost';
import { Toaster } from '@/components/layout/Toaster';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { TutorDashboard } from '@/components/dashboard/TutorDashboard';

const DIRECTION = { ar: 'rtl', fr: 'ltr', en: 'ltr' } as const;

export default function App() {
  const { lang, role } = useApp();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = DIRECTION[lang];
  }, [lang]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-primary-950">
      <Header />
      <DemoBar />
      <main className="flex-1">
        {role === 'student' ? <StudentDashboard /> : role === 'tutor' ? <TutorDashboard /> : <DiscoverPage />}
      </main>
      <Footer />
      <ModalHost />
      <Toaster />
    </div>
  );
}
