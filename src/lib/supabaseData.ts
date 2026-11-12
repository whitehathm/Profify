import type { Booking, Localized, Review, TeachingMode, Tutor } from '@/types';

export interface TutorRow {
  id: string;
  name: string;
  headline: Localized;
  avatar: string;
  city_id: string;
  subject_ids: string[];
  price_per_hour: number;
  rating: number;
  review_count: number;
  verified: boolean;
  published: boolean;
  modes: TeachingMode[];
  experience_years: number;
  bio: Localized;
  qualifications: Localized[];
  available_days: number[];
  slots: string[];
  phone?: string;
  reviews: Review[];
  owner_id?: string | null;
}

export interface BookingRow {
  id: string;
  tutor_id: string;
  student_id: string;
  student_user_id: string | null;
  student_name: string;
  student_phone: string;
  date: string;
  time: string;
  mode: TeachingMode;
  status: Booking['status'];
  created_at: string;
}

export function tutorFromRow(row: TutorRow): Tutor {
  return {
    id: row.id,
    name: row.name,
    headline: row.headline,
    avatar: row.avatar,
    cityId: row.city_id,
    subjectIds: row.subject_ids,
    pricePerHour: Number(row.price_per_hour),
    rating: Number(row.rating),
    reviewCount: row.review_count,
    verified: row.verified,
    published: row.published,
    modes: row.modes,
    experienceYears: row.experience_years,
    bio: row.bio,
    qualifications: row.qualifications,
    availableDays: row.available_days,
    slots: row.slots,
    phone: row.phone ?? '',
    reviews: row.reviews,
    ownerId: row.owner_id ?? null,
  };
}

export function tutorToRow(tutor: Tutor, ownerId: string | null): Record<string, unknown> {
  const row: Record<string, unknown> = {
    id: tutor.id,
    name: tutor.name,
    headline: tutor.headline,
    avatar: tutor.avatar,
    city_id: tutor.cityId,
    subject_ids: tutor.subjectIds,
    price_per_hour: tutor.pricePerHour,
    published: tutor.published,
    modes: tutor.modes,
    experience_years: tutor.experienceYears,
    bio: tutor.bio,
    qualifications: tutor.qualifications,
    available_days: tutor.availableDays,
    slots: tutor.slots,
    phone: tutor.phone,
    reviews: tutor.reviews,
  };

  if (ownerId) row.owner_id = ownerId;
  return row;
}

export function bookingFromRow(row: BookingRow): Booking {
  return {
    id: row.id,
    tutorId: row.tutor_id,
    studentId: row.student_id,
    studentUserId: row.student_user_id,
    studentName: row.student_name,
    studentPhone: row.student_phone,
    date: row.date,
    time: row.time,
    mode: row.mode,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function bookingToRow(booking: Booking): Record<string, unknown> {
  const row: Record<string, unknown> = {
    id: booking.id,
    tutor_id: booking.tutorId,
    student_id: booking.studentId,
    student_name: booking.studentName,
    student_phone: booking.studentPhone,
    date: booking.date,
    time: booking.time,
    mode: booking.mode,
  };

  if (booking.studentUserId) row.student_user_id = booking.studentUserId;
  return row;
}
