import { useState, useEffect } from 'react';
import { BookingModal } from '@/components/tutor/BookingModal';
import type { Tutor } from '@/types';

export function ModalHost() {
  const [activeTutor, setActiveTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      setActiveTutor((event as CustomEvent<Tutor>).detail);
    };

    window.addEventListener('open-booking-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-booking-modal', handleOpenModal);
    };
  }, []);

  if (!activeTutor) return null;

  return (
    <BookingModal
      tutor={activeTutor}
      onClose={() => setActiveTutor(null)}
    />
  );
}
