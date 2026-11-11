import { useApp } from '@/context/AppContext';
import { BookingModal } from '@/components/modals/BookingModal';

export function ModalHost() {
  const { selectedTutorForBooking, setSelectedTutorForBooking } = useApp();

  if (!selectedTutorForBooking) return null;

  return (
    <BookingModal
      tutor={selectedTutorForBooking}
      onClose={() => setSelectedTutorForBooking(null)}
    />
  );
}
