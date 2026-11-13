import { supabase } from '@/lib/supabase';
import { makeId } from '@/lib/format';
import type { ExperienceBand, SpecialtyId } from '@/types';

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  path: string;
  uploadedAt: string;
  storageSynced: boolean;
}

export interface NotificationPrefs {
  lessonRequests: boolean;
  bookingReminders: boolean;
  platformUpdates: boolean;
}

export interface TutorExtras {
  firstName?: string;
  lastName?: string;
  whatsapp?: string;
  specialties?: SpecialtyId[];
  offersFreeTrial?: boolean;
  experienceBand?: ExperienceBand;
  diplomas?: UploadedDoc[];
  cinDocs?: UploadedDoc[];
  notifications?: NotificationPrefs;
}

export interface TutorApplicationPayload {
  tutorId: string;
  userId: string;
  firstName: string;
  lastName: string;
  whatsapp: string;
  primaryLanguage: string;
  specialties: SpecialtyId[];
  modes: string[];
  cityId: string;
  pricePerHour: number;
  offersFreeTrial: boolean;
  headline: string;
  bio: string;
  experienceBand: ExperienceBand;
  avatarUrl: string;
  createdAt: string;
}

const EXTRAS_KEY = 'profify:tutor-extras:v1';
const APPLICATIONS_KEY = 'profify:tutor-applications:v1';

export const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  lessonRequests: true,
  bookingReminders: true,
  platformUpdates: false,
};

function readExtrasMap(): Record<string, TutorExtras> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(EXTRAS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, TutorExtras>) : {};
  } catch {
    return {};
  }
}

export function getTutorExtras(tutorId: string): TutorExtras {
  const map = readExtrasMap();
  return map[tutorId] ?? {};
}

export function saveTutorExtras(tutorId: string, patch: Partial<TutorExtras>): TutorExtras {
  const map = readExtrasMap();
  const next: TutorExtras = { ...(map[tutorId] ?? {}), ...patch };
  map[tutorId] = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(EXTRAS_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage quota errors cleanly.
    }
  }
  return next;
}

export function clearTutorExtras(tutorId: string): void {
  const map = readExtrasMap();
  delete map[tutorId];
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(EXTRAS_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage errors cleanly.
    }
  }
}

export async function submitTutorApplication(
  payload: TutorApplicationPayload,
): Promise<{ synced: boolean; errorMessage?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(APPLICATIONS_KEY);
      const list = raw ? (JSON.parse(raw) as TutorApplicationPayload[]) : [];
      window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([payload, ...list]));
    } catch {
      // Ignore local storage errors.
    }
  }

  if (!supabase) return { synced: false };

  try {
    const { error } = await supabase.from('tutor_applications').insert({
      tutor_id: payload.tutorId,
      user_id: payload.userId,
      first_name: payload.firstName,
      last_name: payload.lastName,
      whatsapp: payload.whatsapp,
      primary_language: payload.primaryLanguage,
      specialties: payload.specialties,
      modes: payload.modes,
      city_id: payload.cityId,
      price_per_hour: payload.pricePerHour,
      offers_free_trial: payload.offersFreeTrial,
      headline: payload.headline,
      bio: payload.bio,
      experience_band: payload.experienceBand,
      avatar_url: payload.avatarUrl,
    });
    if (error) {
      console.error('[Profify] tutor_applications insert failed:', error);
      return { synced: false, errorMessage: error.message };
    }
    return { synced: true };
  } catch (err) {
    console.error('[Profify] tutor_applications insert threw:', err);
    return { synced: false, errorMessage: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function uploadToPrivateBucket(
  file: File,
  folder: 'diplomas' | 'cin',
  userId: string,
): Promise<UploadedDoc> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${folder}/${Date.now()}-${safeName}`;
  let storageSynced = false;

  if (supabase) {
    try {
      const { error } = await supabase.storage
        .from('tutor-private-uploads')
        .upload(path, file, { upsert: true });
      storageSynced = !error;
    } catch {
      storageSynced = false;
    }
  }

  return {
    id: makeId('doc'),
    name: file.name,
    size: file.size,
    path,
    uploadedAt: new Date().toISOString(),
    storageSynced,
  };
}

export function compressImageFile(file: File, maxSize = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Empty image data'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function formatMoroccoWhatsapp(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('212')) return `+${digits}`;
  if (digits.startsWith('0')) return `+212${digits.slice(1)}`;
  return `+212${digits}`;
}

export function isValidMoroccoWhatsapp(input: string): boolean {
  const normalized = formatMoroccoWhatsapp(input);
  return /^\+212[5-7]\d{8}$/.test(normalized);
}
