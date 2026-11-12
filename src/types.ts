export type Lang = 'ar' | 'fr' | 'en';
export type Localized = Record<Lang, string>;
export type Role = 'visitor' | 'student' | 'tutor';
export type TeachingMode = 'online' | 'in_person';
export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type SortOption = 'rating' | 'price_asc' | 'price_desc';

export interface Subject {
  id: string;
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
  headline: Localized;
  avatar: string;
  cityId: string;
  subjectIds: string[];
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  published: boolean;
  modes: TeachingMode[];
  experienceYears: number;
  bio: Localized;
  qualifications: Localized[];
  availableDays: number[];
  slots: string[];
  phone: string;
  reviews: Review[];
}

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
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
