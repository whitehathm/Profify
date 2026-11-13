import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ModalHost } from '@/components/layout/ModalHost';
import { Toaster } from '@/components/layout/Toaster';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { TutorDashboard } from '@/components/dashboard/TutorDashboard';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { ContactPage } from '@/pages/ContactPage';
import { WhyTeachSection } from '@/components/tutor/WhyTeachSection';
import { TutorOnboardingWizard } from '@/components/tutor/TutorOnboardingWizard';

const DIRECTION = { ar: 'rtl', fr: 'ltr', en: 'ltr' } as const;

export default function App() {
  const { lang, role, view, tutorWizardOpen, hasTutorProfile } = useApp();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = DIRECTION[lang];
  }, [lang]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-primary-950 antialiased">
      <Header />
      <main className="flex-1 bg-white">
        {role === 'student' ? (
          <StudentDashboard />
        ) : role === 'tutor' ? (
          <TutorDashboard />
        ) : view === 'how-it-works' ? (
          <HowItWorksPage />
        ) : view === 'become-tutor' ? (
          tutorWizardOpen ? (
            <TutorOnboardingWizard />
          ) : hasTutorProfile ? (
            <TutorDashboard />
          ) : (
            <WhyTeachSection />
          )
        ) : view === 'contact' ? (
          <ContactPage />
        ) : (
          <DiscoverPage />
        )}
      </main>
      <Footer />
      <ModalHost />
      <Toaster />
    </div>
  );
}
