import type { City, ExperienceBand, Lang, Localized, SpecialtyId, Subject } from '@/types';

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
  { id: 'tangier', label: { ar: 'طنجة', fr: 'Tanger', en: 'Tangier' } },
  { id: 'fes', label: { ar: 'فاس', fr: 'Fès', en: 'Fes' } },
  { id: 'agadir', label: { ar: 'أكادير', fr: 'Agadir', en: 'Agadir' } },
  { id: 'meknes', label: { ar: 'مكناس', fr: 'Meknès', en: 'Meknes' } },
  { id: 'oujda', label: { ar: 'وجدة', fr: 'Oujda', en: 'Oujda' } },
  { id: 'kenitra', label: { ar: 'القنيطرة', fr: 'Kénitra', en: 'Kenitra' } },
  { id: 'tetouan', label: { ar: 'تطوان', fr: 'Tétouan', en: 'Tetouan' } },
];

export const SPECIALTIES: { id: SpecialtyId; label: Localized; hint: Localized }[] = [
  {
    id: 'conversation',
    label: { ar: 'المحادثة والطلاقة', fr: 'Conversation', en: 'Conversation' },
    hint: { ar: 'التحدث بثقة في الحياة اليومية', fr: 'Parler avec aisance au quotidien', en: 'Fluency & everyday speaking' },
  },
  {
    id: 'exam_prep',
    label: { ar: 'التحضير للامتحانات (IELTS/DELF/TCF/Goethe)', fr: 'Préparation examens (IELTS/DELF/TCF/Goethe)', en: 'Exam Prep (IELTS/DELF/TCF/Goethe)' },
    hint: { ar: 'تدريب موجّه على الشهادات الدولية', fr: 'Entraînement ciblé aux certifications', en: 'Targeted test strategies & mock exams' },
  },
  {
    id: 'business',
    label: { ar: 'لغة الأعمال والعمل', fr: 'Langue des affaires', en: 'Business Language' },
    hint: { ar: 'الاجتماعات، العروض، والمقابلات', fr: 'Réunions, présentations et entretiens', en: 'Meetings, interviews & presentations' },
  },
  {
    id: 'beginners',
    label: { ar: 'المبتدئون A1–A2', fr: 'Débutants A1–A2', en: 'Beginners A1–A2' },
    hint: { ar: 'أساسيات النطق والقواعد خطوة بخطوة', fr: 'Bases de grammaire et prononciation', en: 'Step-by-step foundations' },
  },
  {
    id: 'academic',
    label: { ar: 'الدعم المدرسي والجامعي', fr: 'Soutien scolaire et universitaire', en: 'Academic Support' },
    hint: { ar: 'مواكبة الدروس والفروض والامتحانات', fr: 'Accompagnement devoirs et examens', en: 'Homework, coursework & essays' },
  },
];

export const EXPERIENCE_BANDS: { id: ExperienceBand; years: number; label: Localized }[] = [
  { id: '1-2', years: 2, label: { ar: '1–2 سنوات', fr: '1–2 ans', en: '1–2 yrs' } },
  { id: '3-5', years: 4, label: { ar: '3–5 سنوات', fr: '3–5 ans', en: '3–5 yrs' } },
  { id: '5+', years: 6, label: { ar: '5+ سنوات', fr: '5+ ans', en: '5+ yrs' } },
];

export function subjectLabel(id: string, lang: Lang): string {
  return SUBJECTS.find((subject) => subject.id === id)?.label[lang] ?? '';
}

export function cityLabel(id: string, lang: Lang): string {
  return CITIES.find((city) => city.id === id)?.label[lang] ?? '';
}
