export type Lang = 'ar' | 'fr' | 'en';
export type Localized = Record<Lang, string>;
export type Role = 'visitor' | 'student' | 'tutor';
export type TeachingMode = 'online' | 'in_person';
export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type SortOption = 'rating' | 'price_asc' | 'price_desc';
export type SpecialtyId = 'conversation' | 'exam_prep' | 'business' | 'beginners' | 'academic';
export type ExperienceBand = '1-2' | '3-5' | '5+';

export interface Subject {
  id: string;
  code: string;
  native: string;
  label: Localized;
}

export interface City {
  id: string;
  label: Localized;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: Localized;
}

export interface Tutor {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  headline: Localized;
  avatar: string;
  cityId: string;
  subjectIds: string[];
  specialties?: SpecialtyId[];
  pricePerHour: number;
  offersFreeTrial?: boolean;
  rating: number;
  reviewCount: number;
  verified: boolean;
  published: boolean;
  modes: TeachingMode[];
  experienceYears: number;
  experienceBand?: ExperienceBand;
  bio: Localized;
  qualifications: Localized[];
  availableDays: number[];
  slots: string[];
  phone: string;
  reviews: Review[];
  ownerId?: string | null;
}

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  studentUserId?: string | null;
  studentName: string;
  studentPhone: string;
  date: string;
  time: string;
  mode: TeachingMode;
  status: BookingStatus;
  createdAt: string;
}

export interface TutorFilters {
  query: string;
  subjectId: string | null;
  cityId: string | null;
  mode: 'all' | TeachingMode;
  maxPrice: number;
  minRating: number;
  sort: SortOption;
}

export type ModalState =
  | { type: 'become-tutor' }
  | { type: 'profile'; tutorId: string }
  | { type: 'book'; tutorId: string; date?: string; time?: string }
  | { type: 'contact'; tutorId: string }
  | { type: 'auth'; mode: 'login' | 'register' }
  | null;

export interface Toast {
  id: string;
  message: string;
}
