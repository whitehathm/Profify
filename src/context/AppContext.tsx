import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import useSWR from 'swr';
import type { AuthError, Session } from '@supabase/supabase-js';
import type { Booking, BookingStatus, Lang, Localized, ModalState, Review, Role, TeachingMode, Toast, Tutor } from '@/types';
import { supabase, supabaseAuthRedirectUrl } from '@/lib/supabase';
import { TUTORS } from '@/data/tutors';
import { SEED_BOOKINGS } from '@/data/bookings';
import { CURRENT_STUDENT_ID } from '@/data/catalog';
import { strings, type StringKey } from '@/i18n/strings';
import { interpolate, makeId } from '@/lib/format';
import { bookingFromRow, bookingToRow, tutorFromRow, tutorToRow, type BookingRow, type TutorRow } from '@/lib/supabaseData';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export type AuthErrorKey =
  | 'authUnavailable'
  | 'authInvalidCredentials'
  | 'authEmailNotConfirmed'
  | 'authWeakPassword'
  | 'authInvalidEmail'
  | 'authEmailNotAuthorized'
  | 'authValidationFailed'
  | 'authRateLimit'
  | 'authUnexpected';

export interface AuthResult {
  error?: AuthErrorKey;
  needsEmailConfirmation?: boolean;
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
  loginWithPassword: (email: string, password: string) => Promise<AuthResult>;
  registerWithPassword: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<boolean>;
  tutors: Tutor[];
  addTutor: (profile: Omit<Tutor, 'id'>) => Promise<Tutor | null>;
  updateTutor: (id: string, patch: Partial<Tutor>) => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  bookings: Booking[];
  addBooking: (input: NewBooking) => Promise<boolean>;
  setBookingStatus: (id: string, status: BookingStatus) => Promise<boolean>;
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

function toCurrentUser(session: Session | null): CurrentUser | null {
  const authUser = session?.user;
  if (!authUser) return null;

  const metadataName = authUser.user_metadata.full_name ?? authUser.user_metadata.name;
  return {
    id: authUser.id,
    name: typeof metadataName === 'string' && metadataName.trim()
      ? metadataName.trim()
      : authUser.email?.split('@')[0] ?? 'Profify user',
    email: authUser.email ?? '',
  };
}

function getAuthErrorKey(error: AuthError): AuthErrorKey {
  if (error.code === 'email_not_confirmed') return 'authEmailNotConfirmed';
  if (error.code === 'weak_password') return 'authWeakPassword';
  if (error.code === 'email_address_invalid') return 'authInvalidEmail';
  if (error.code === 'email_address_not_authorized') return 'authEmailNotAuthorized';
  if (error.code === 'validation_failed') return 'authValidationFailed';
  if (error.code === 'over_email_send_rate_limit' || error.status === 429) return 'authRateLimit';
  if (error.code === 'invalid_credentials') return 'authInvalidCredentials';
  return 'authUnexpected';
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

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toCurrentUser(session));
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setUser(toCurrentUser(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorageArray(SAVED_TUTORS_STORAGE_KEY, [], isSavedTutorIdArray),
  );
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const tutorFallback = supabase ? [...TUTORS] : [...TUTORS, ...readCustomTutors()];
  const bookingFallback = supabase
    ? SEED_BOOKINGS
    : readStorageArray(BOOKINGS_STORAGE_KEY, SEED_BOOKINGS, isBookingArray);
  const tutorsKey = useMemo(() => ['profify:tutors', user?.id ?? 'public'] as const, [user?.id]);
  const bookingsKey = useMemo(() => ['profify:bookings', user?.id ?? 'guest'] as const, [user?.id]);

  const {
    data: tutors = tutorFallback,
    mutate: mutateTutors,
  } = useSWR<Tutor[]>(tutorsKey, async () => {
    if (!supabase) return [...TUTORS, ...readCustomTutors()];

    const publicColumns = 'id, name, headline, avatar, city_id, subject_ids, price_per_hour, rating, review_count, verified, published, modes, experience_years, bio, qualifications, available_days, slots, reviews';
    const columns = user ? `${publicColumns}, owner_id` : publicColumns;
    const { data, error } = await supabase
      .from('tutors')
      .select(columns)
      .order('created_at', { ascending: false });

    if (error || !data?.length) return [...TUTORS];

    const remoteTutors = (data as unknown as TutorRow[]).map(tutorFromRow);
    const seedIds = new Set(TUTORS.map((tutor) => tutor.id));
    const liveTutors = remoteTutors.filter((tutor) => !seedIds.has(tutor.id));
    return [...liveTutors, ...TUTORS];
  }, {
    fallbackData: tutorFallback,
    revalidateOnFocus: true,
  });

  const {
    data: bookings = bookingFallback,
    mutate: mutateBookings,
  } = useSWR<Booking[]>(bookingsKey, async () => {
    if (!supabase) return readStorageArray(BOOKINGS_STORAGE_KEY, SEED_BOOKINGS, isBookingArray);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error || !data?.length) return SEED_BOOKINGS;
    return (data as unknown as BookingRow[]).map(bookingFromRow);
  }, {
    fallbackData: bookingFallback,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (supabase) return;
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
    if (supabase) return;
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
      if (!supabase && (event.key === null || event.key === BOOKINGS_STORAGE_KEY)) {
        void mutateBookings(readStorageArray(BOOKINGS_STORAGE_KEY, SEED_BOOKINGS, isBookingArray), { revalidate: false });
      }
      if (event.key === null || event.key === SAVED_TUTORS_STORAGE_KEY) {
        setSavedIds(readStorageArray(SAVED_TUTORS_STORAGE_KEY, [], isSavedTutorIdArray));
      }
      if (!supabase && (event.key === null || event.key === CUSTOM_TUTORS_STORAGE_KEY)) {
        void mutateTutors([...TUTORS, ...readCustomTutors()], { revalidate: false });
      }
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, [mutateBookings, mutateTutors]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client
      .channel(`profify-live-${user?.id ?? 'public'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tutors' }, () => {
        void mutateTutors();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        void mutateBookings();
      })
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [user?.id, mutateBookings, mutateTutors]);

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

  const loginWithPassword = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'authUnavailable' };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { error: getAuthErrorKey(error) } : {};
  }, []);

  const registerWithPassword = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'authUnavailable' };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: supabaseAuthRedirectUrl || window.location.origin,
      },
    });
    if (error) return { error: getAuthErrorKey(error) };
    return { needsEmailConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async (): Promise<boolean> => {
    if (!supabase) {
      setUser(null);
      return true;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return false;
      setUser(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  const addTutor = useCallback(async (profile: Omit<Tutor, 'id'>): Promise<Tutor | null> => {
    const tutor: Tutor = { ...profile, id: makeId('tutor'), ownerId: user?.id ?? null };
    if (supabase) {
      const { error } = await supabase.from('tutors').insert(tutorToRow(tutor, user?.id ?? null));
      if (error) return null;
    }

    await mutateTutors((current = []) => [tutor, ...current.filter((item) => item.id !== tutor.id)], { revalidate: false });
    return tutor;
  }, [user?.id, mutateTutors]);

  const updateTutor = useCallback((id: string, patch: Partial<Tutor>) => {
    const existing = tutors.find((tutor) => tutor.id === id);
    if (!existing) return;
    const updated = { ...existing, ...patch };

    const save = async () => {
      try {
        if (supabase && user && existing.ownerId === user.id) {
          const row = tutorToRow(updated, user.id);
          delete row.id;
          delete row.owner_id;
          const { error } = await supabase.from('tutors').update(row).eq('id', id);
          if (error) {
            notify(t('tutorSaveFailed'));
            return;
          }
        }
        void mutateTutors((current = []) => current.map((tutor) => (tutor.id === id ? updated : tutor)), { revalidate: false });
      } catch {
        notify(t('tutorSaveFailed'));
      }
    };

    void save();
  }, [tutors, user, mutateTutors, notify, t]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
  }, []);

  const addBooking = useCallback(async (input: NewBooking): Promise<boolean> => {
    const booking: Booking = {
      id: makeId('booking'),
      studentId: user?.id ?? CURRENT_STUDENT_ID,
      studentUserId: user?.id ?? null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...input,
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').insert(bookingToRow(booking));
        if (error) {
          notify(t('bookingSaveFailed'));
          return false;
        }
      } catch {
        notify(t('bookingSaveFailed'));
        return false;
      }
    }

    await mutateBookings((current = []) => [booking, ...current.filter((item) => item.id !== booking.id)], { revalidate: false });
    return true;
  }, [user?.id, mutateBookings, notify, t]);

  const setBookingStatus = useCallback(async (id: string, status: BookingStatus): Promise<boolean> => {
    const isSeedBooking = SEED_BOOKINGS.some((booking) => booking.id === id);
    if (supabase && !isSeedBooking) {
      if (!user) {
        notify(t('bookingUpdateFailed'));
        return false;
      }
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', id)
          .select('id');
        if (error || !data?.length) {
          notify(t('bookingUpdateFailed'));
          return false;
        }
      } catch {
        notify(t('bookingUpdateFailed'));
        return false;
      }
    }

    await mutateBookings((current = []) => current.map((booking) => (booking.id === id ? { ...booking, status } : booking)), { revalidate: false });
    return true;
  }, [user, mutateBookings, notify, t]);

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
      loginWithPassword,
      registerWithPassword,
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
      loginWithPassword,
      registerWithPassword,
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
