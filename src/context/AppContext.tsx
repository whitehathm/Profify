import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Booking, BookingStatus, Lang, Localized, ModalState, Review, Role, TeachingMode, Toast, Tutor } from '@/types';
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
  addTutor: (profile: Omit<Tutor, 'id'>) => Tutor;
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
const BOOKINGS_STORAGE_KEY = 'profify:bookings:v1';
const SAVED_TUTORS_STORAGE_KEY = 'profify:saved-tutor-ids:v1';

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== 'object') return false;
  const booking = value as Partial<Booking>;
  return (
    typeof booking.id === 'string' &&
    typeof booking.tutorId === 'string' &&
    typeof booking.studentId === 'string' &&
    typeof booking.studentName === 'string' &&
    typeof booking.studentPhone === 'string' &&
    typeof booking.date === 'string' &&
    typeof booking.time === 'string' &&
    (booking.mode === 'online' || booking.mode === 'in_person') &&
    ['pending', 'accepted', 'declined', 'cancelled'].includes(booking.status ?? '') &&
    typeof booking.createdAt === 'string'
  );
}

function isBookingArray(value: unknown): value is Booking[] {
  return Array.isArray(value) && value.every(isBooking);
}

function isSavedTutorIdArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === 'string');
}

function readStorageArray<T>(key: string, fallback: T[], isValid: (value: unknown) => value is T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallback;
    const parsed: unknown = JSON.parse(stored);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

const CUSTOM_TUTORS_STORAGE_KEY = 'profify:custom-tutors:v1';

function isLocalizedText(value: unknown): value is Localized {
  if (!value || typeof value !== 'object') return false;
  const localized = value as Partial<Localized>;
  return typeof localized.ar === 'string' && typeof localized.fr === 'string' && typeof localized.en === 'string';
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== 'object') return false;
  const review = value as Partial<Review>;
  return (
    typeof review.id === 'string' &&
    typeof review.author === 'string' &&
    typeof review.rating === 'number' &&
    typeof review.date === 'string' &&
    isLocalizedText(review.comment)
  );
}

function isTutor(value: unknown): value is Tutor {
  if (!value || typeof value !== 'object') return false;
  const tutor = value as Partial<Tutor>;
  return (
    typeof tutor.id === 'string' &&
    typeof tutor.name === 'string' &&
    isLocalizedText(tutor.headline) &&
    typeof tutor.avatar === 'string' &&
    typeof tutor.cityId === 'string' &&
    Array.isArray(tutor.subjectIds) && tutor.subjectIds.every((id) => typeof id === 'string') &&
    typeof tutor.pricePerHour === 'number' &&
    typeof tutor.rating === 'number' &&
    typeof tutor.reviewCount === 'number' &&
    typeof tutor.verified === 'boolean' &&
    typeof tutor.published === 'boolean' &&
    Array.isArray(tutor.modes) && tutor.modes.every((mode) => mode === 'online' || mode === 'in_person') &&
    typeof tutor.experienceYears === 'number' &&
    isLocalizedText(tutor.bio) &&
    Array.isArray(tutor.qualifications) && tutor.qualifications.every(isLocalizedText) &&
    Array.isArray(tutor.availableDays) && tutor.availableDays.every((day) => typeof day === 'number') &&
    Array.isArray(tutor.slots) && tutor.slots.every((slot) => typeof slot === 'string') &&
    typeof tutor.phone === 'string' &&
    Array.isArray(tutor.reviews) && tutor.reviews.every(isReview)
  );
}

function isTutorArray(value: unknown): value is Tutor[] {
  return Array.isArray(value) && value.every(isTutor);
}

function readCustomTutors(): Tutor[] {
  const catalogIds = new Set(TUTORS.map((tutor) => tutor.id));
  return readStorageArray(CUSTOM_TUTORS_STORAGE_KEY, [], isTutorArray)
    .filter((tutor) => !catalogIds.has(tutor.id));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');
  const [role, setRole] = useState<Role>('visitor');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>(() => [...TUTORS, ...readCustomTutors()]);
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorageArray(SAVED_TUTORS_STORAGE_KEY, [], isSavedTutorIdArray),
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    readStorageArray(BOOKINGS_STORAGE_KEY, SEED_BOOKINGS, isBookingArray),
  );
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      return;
    }
  }, [bookings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_TUTORS_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      return;
    }
  }, [savedIds]);

  useEffect(() => {
    const catalogIds = new Set(TUTORS.map((tutor) => tutor.id));
    const customTutors = tutors.filter((tutor) => !catalogIds.has(tutor.id));
    try {
      window.localStorage.setItem(CUSTOM_TUTORS_STORAGE_KEY, JSON.stringify(customTutors));
    } catch {
      return;
    }
  }, [tutors]);

  useEffect(() => {
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === BOOKINGS_STORAGE_KEY) {
        setBookings(readStorageArray(BOOKINGS_STORAGE_KEY, SEED_BOOKINGS, isBookingArray));
      }
      if (event.key === null || event.key === SAVED_TUTORS_STORAGE_KEY) {
        setSavedIds(readStorageArray(SAVED_TUTORS_STORAGE_KEY, [], isSavedTutorIdArray));
      }
      if (event.key === null || event.key === CUSTOM_TUTORS_STORAGE_KEY) {
        setTutors([...TUTORS, ...readCustomTutors()]);
      }
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

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

  const addTutor = useCallback((profile: Omit<Tutor, 'id'>) => {
    const tutor: Tutor = { ...profile, id: makeId('tutor') };
    setTutors((previous) => [...previous, tutor]);
    return tutor;
  }, []);

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
      addTutor,
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
      addTutor,
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
