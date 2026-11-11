import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Booking, BookingStatus, Lang, ModalState, Role, TeachingMode, Toast, Tutor } from '@/types';
import { TUTORS } from '@/data/tutors';
import { SEED_BOOKINGS } from '@/data/bookings';
import { CURRENT_STUDENT_ID } from '@/data/catalog';
import { strings, type StringKey } from '@/i18n/strings';
import { interpolate, makeId } from '@/lib/format';

export interface CurrentUser {
  name: string;
  email: string;
}

export interface NewBooking {
  tutorId: string;
  studentName: string;
  studentPhone: string;
  date: string;
  time: string;
  mode: TeachingMode;
}

type TranslateFn = (key: StringKey, vars?: Record<string, string | number>) => string;

interface AppContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslateFn;
  role: Role;
  setRole: (role: Role) => void;
  user: CurrentUser | null;
  signIn: (user: CurrentUser) => void;
  signOut: () => void;
  tutors: Tutor[];
  updateTutor: (id: string, patch: Partial<Tutor>) => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  bookings: Booking[];
  addBooking: (input: NewBooking) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  modal: ModalState;
  openModal: (modal: Exclude<ModalState, null>) => void;
  closeModal: () => void;
  toasts: Toast[];
  notify: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const TOAST_DURATION_MS = 3000;

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');
  const [role, setRole] = useState<Role>('visitor');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>(TUTORS);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const t = useCallback<TranslateFn>(
    (key, vars) => interpolate(strings[key][lang], vars),
    [lang],
  );

  const notify = useCallback((message: string) => {
    const id = makeId('toast');
    setToasts((previous) => [...previous, { id, message }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const signIn = useCallback((nextUser: CurrentUser) => setUser(nextUser), []);
  const signOut = useCallback(() => setUser(null), []);

  const updateTutor = useCallback((id: string, patch: Partial<Tutor>) => {
    setTutors((previous) => previous.map((tutor) => (tutor.id === id ? { ...tutor, ...patch } : tutor)));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
  }, []);

  const addBooking = useCallback((input: NewBooking) => {
    const booking: Booking = {
      id: makeId('booking'),
      studentId: CURRENT_STUDENT_ID,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...input,
    };
    setBookings((previous) => [booking, ...previous]);
  }, []);

  const setBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((previous) => previous.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
  }, []);

  const openModal = useCallback((next: Exclude<ModalState, null>) => setModal(next), []);
  const closeModal = useCallback(() => setModal(null), []);

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      t,
      role,
      setRole,
      user,
      signIn,
      signOut,
      tutors,
      updateTutor,
      savedIds,
      toggleSaved,
      bookings,
      addBooking,
      setBookingStatus,
      modal,
      openModal,
      closeModal,
      toasts,
      notify,
    }),
    [
      lang,
      t,
      role,
      user,
      signIn,
      signOut,
      tutors,
      updateTutor,
      savedIds,
      toggleSaved,
      bookings,
      addBooking,
      setBookingStatus,
      modal,
      openModal,
      closeModal,
      toasts,
      notify,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
