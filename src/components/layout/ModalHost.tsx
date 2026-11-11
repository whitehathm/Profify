import { useApp } from '@/context/AppContext';
import { BookingModal } from '@/components/modals/BookingModal';

export function ModalHost() {
  const { selectedTutorForBooking } = useApp();

  return (
    <>
      {selectedTutorForBooking && <BookingModal />}
    </>
  );
}
