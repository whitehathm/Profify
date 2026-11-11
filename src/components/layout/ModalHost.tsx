import { useApp } from '@/context/AppContext';
import { TutorProfileModal } from '@/components/tutor/TutorProfileModal';
import { BookingModal } from '@/components/tutor/BookingModal';
import { ContactModal } from '@/components/tutor/ContactModal';
import { AuthModal } from '@/components/auth/AuthModal';

export function ModalHost() {
  const { modal } = useApp();
  if (!modal) return null;

  switch (modal.type) {
    case 'profile':
      return <TutorProfileModal tutorId={modal.tutorId} />;
    case 'book':
      return <BookingModal tutorId={modal.tutorId} initialDate={modal.date} initialTime={modal.time} />;
    case 'contact':
      return <ContactModal tutorId={modal.tutorId} />;
    case 'auth':
      return <AuthModal initialMode={modal.mode} />;
  }
}
