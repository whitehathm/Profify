import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { TutorFilters } from '@/types';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { searchInputClass } from '@/components/ui/Field';
import { buildSuggestions } from '@/lib/tutorFilters';

interface SearchAutocompleteProps {
  value: string;
  onChange: (query: string) => void;
  onPickSubject: (subjectId: string) => void;
}

export function SearchAutocomplete({ value, onChange, onPickSubject }: SearchAutocompleteProps) {
  const { t, tutors, lang, openModal } = useApp();
  const [focused, setFocused] = useState(false);
  const suggestions = useMemo(() => buildSuggestions(tutors, value, lang), [tutors, value, lang]);
  const showList = focused && value.trim().length > 0;

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        value={value}
        placeholder={t('searchPlaceholder')}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => onChange(event.target.value)}
        className={searchInputClass}
      />
      {showList && (
        <ul
          role="listbox"
          className="absolute start-0 end-0 top-full z-30 mt-2 overflow-hidden rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200 animate-scale-in"
        >
          {suggestions.length === 0 && <li className="px-3 py-2.5 text-sm text-slate-600">{t('noSuggestions')}</li>}
          {suggestions.map((item) => (
            <li
              key={`${item.kind}-${item.id}`}
              role="option"
              aria-selected={false}
              onMouseDown={(event) => {
                event.preventDefault();
                if (item.kind === 'subject') onPickSubject(item.id);
                else openModal({ type: 'profile', tutorId: item.id });
                onChange('');
                setFocused(false);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-primary-50"
            >
              {item.kind === 'tutor' && item.avatar ? (
                <Avatar src={item.avatar} name={item.title} size="sm" />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-sm font-bold text-accent-800">
                  {item.title.charAt(0)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-primary-950">{item.title}</span>
                <span className="block truncate text-xs text-slate-600">
                  {item.kind === 'subject' ? t('suggestionSubject') : item.subtitle}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type { TutorFilters };
