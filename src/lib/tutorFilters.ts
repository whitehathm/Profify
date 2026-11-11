import type { Lang, Tutor, TutorFilters, SortOption } from '@/types';
import { SUBJECTS, subjectLabel } from '@/data/catalog';

export const PRICE_MIN = 50;
export const PRICE_MAX = 300;
export const RATING_OPTIONS = [0, 4, 4.5, 4.8];

export const DEFAULT_FILTERS: TutorFilters = {
  query: '',
  subjectId: null,
  cityId: null,
  mode: 'all',
  maxPrice: PRICE_MAX,
  minRating: 0,
  sort: 'rating',
};

export interface Suggestion {
  kind: 'subject' | 'tutor';
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
}

export function countActiveFilters(filters: TutorFilters): number {
  return [
    filters.subjectId !== null,
    filters.cityId !== null,
    filters.mode !== 'all',
    filters.maxPrice < PRICE_MAX,
    filters.minRating > 0,
  ].filter(Boolean).length;
}

function sortTutors(list: Tutor[], sort: SortOption): Tutor[] {
  const sorted = [...list];
  if (sort === 'price_asc') return sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
  if (sort === 'price_desc') return sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
  return sorted.sort((a, b) => b.rating - a.rating);
}

export function filterTutors(tutors: Tutor[], filters: TutorFilters, lang: Lang): Tutor[] {
  const query = filters.query.trim().toLowerCase();
  const matched = tutors.filter(
    (tutor) =>
      tutor.published &&
      (!filters.subjectId || tutor.subjectIds.includes(filters.subjectId)) &&
      (!filters.cityId || tutor.cityId === filters.cityId) &&
      tutor.pricePerHour <= filters.maxPrice &&
      tutor.rating >= filters.minRating &&
      (filters.mode === 'all' || tutor.modes.includes(filters.mode)) &&
      (!query ||
        tutor.name.toLowerCase().includes(query) ||
        tutor.subjectIds.some((id) => subjectLabel(id, lang).toLowerCase().includes(query))),
  );
  return sortTutors(matched, filters.sort);
}

export function buildSuggestions(tutors: Tutor[], query: string, lang: Lang): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const subjects: Suggestion[] = SUBJECTS.filter((subject) => subject.label[lang].toLowerCase().includes(q))
    .slice(0, 3)
    .map((subject) => ({ kind: 'subject', id: subject.id, title: subject.label[lang], subtitle: '' }));
  const people: Suggestion[] = tutors
    .filter((tutor) => tutor.published && tutor.name.toLowerCase().includes(q))
    .slice(0, 5)
    .map((tutor) => ({
      kind: 'tutor',
      id: tutor.id,
      title: tutor.name,
      subtitle: tutor.subjectIds.map((id) => subjectLabel(id, lang)).join(' · '),
      avatar: tutor.avatar,
    }));
  return [...subjects, ...people];
}
