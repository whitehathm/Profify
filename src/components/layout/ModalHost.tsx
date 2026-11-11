import { useState, useEffect } from 'react';
import { BookingModal } from '@/components/modals/BookingModal';
import type { Tutor } from '@/types';

export function ModalHost() {
  const [activeTutor, setActiveTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<Tutor>) => {
      setActiveTutor(event.detail);
    };

    window.addEventListener('open-booking-modal' as any, handleOpenModal as any);
    return () => {
      window.removeEventListener('open-booking-modal' as any, handleOpenModal as any);
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
