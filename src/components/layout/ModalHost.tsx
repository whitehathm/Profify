import { AuthModal } from '@/components/auth/AuthModal';
import { ContactModal } from '@/components/tutor/ContactModal';
import { BookingModal } from '@/components/tutor/BookingModal';
import { TutorProfileModal } from '@/components/tutor/TutorProfileModal';
import { useApp } from '@/context/AppContext';

export function ModalHost() {
  const { modal } = useApp();

  if (!modal) return null;

  switch (modal.type) {
    case 'profile':
      return <TutorProfileModal key={`profile-${modal.tutorId}`} tutorId={modal.tutorId} />;
    case 'book':
      return (
        <BookingModal
          key={`booking-${modal.tutorId}`}
          tutorId={modal.tutorId}
          initialDate={modal.date}
          initialTime={modal.time}
        />
      );
    case 'contact':
      return <ContactModal key={`contact-${modal.tutorId}`} tutorId={modal.tutorId} />;
    case 'auth':
      return <AuthModal key={`auth-${modal.mode}`} initialMode={modal.mode} />;
    default:
      return null;
  }
}
