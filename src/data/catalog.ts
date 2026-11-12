import type { City, Lang, Subject } from '@/types';

export const CURRENT_STUDENT_ID = 'me';
export const CURRENT_TUTOR_ID = 't1';

export const photoUrl = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`;

export const HERO_IMAGE = photoUrl('8199762');

export const SUBJECTS: Subject[] = [
  { id: 'english', code: 'EN', native: 'English', label: { ar: 'الإنجليزية', fr: 'Anglais', en: 'English' } },
  { id: 'french', code: 'FR', native: 'Français', label: { ar: 'الفرنسية', fr: 'Français', en: 'French' } },
  { id: 'spanish', code: 'ES', native: 'Español', label: { ar: 'الإسبانية', fr: 'Espagnol', en: 'Spanish' } },
  { id: 'german', code: 'DE', native: 'Deutsch', label: { ar: 'الألمانية', fr: 'Allemand', en: 'German' } },
  { id: 'arabic', code: 'AR', native: 'العربية', label: { ar: 'العربية', fr: 'Arabe', en: 'Arabic' } },
];

export const CITIES: City[] = [
  { id: 'casablanca', label: { ar: 'الدار البيضاء', fr: 'Casablanca', en: 'Casablanca' } },
  { id: 'rabat', label: { ar: 'الرباط', fr: 'Rabat', en: 'Rabat' } },
  { id: 'marrakech', label: { ar: 'مراكش', fr: 'Marrakech', en: 'Marrakech' } },
  { id: 'fes', label: { ar: 'فاس', fr: 'Fès', en: 'Fes' } },
  { id: 'tangier', label: { ar: 'طنجة', fr: 'Tanger', en: 'Tangier' } },
  { id: 'agadir', label: { ar: 'أكادير', fr: 'Agadir', en: 'Agadir' } },
];

export function subjectLabel(id: string, lang: Lang): string {
  return SUBJECTS.find((subject) => subject.id === id)?.label[lang] ?? '';
}

export function cityLabel(id: string, lang: Lang): string {
  return CITIES.find((city) => city.id === id)?.label[lang] ?? '';
}
