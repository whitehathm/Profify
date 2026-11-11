import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { SUBJECTS, subjectLabel } from '@/data/catalog';
import { useApp } from '@/context/AppContext';
import { inputClass } from '@/components/ui/Field';

interface SubjectComboboxProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

interface Item {
  id: string | null;
  label: string;
}

export function SubjectCombobox({ value, onChange }: SubjectComboboxProps) {
  const { t, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const query = text.trim().toLowerCase();
  const items: Item[] = [
    { id: null, label: t('allSubjects') },
    ...SUBJECTS.filter((subject) => subject.label[lang].toLowerCase().includes(query)).map((subject) => ({
      id: subject.id,
      label: subject.label[lang],
    })),
  ];

  const pick = (id: string | null) => {
    onChange(id);
    setOpen(false);
    setText('');
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pick(items[active]?.id ?? null);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={`${inputClass} pe-10`}
        placeholder={t('allSubjects')}
        value={open ? text : value ? subjectLabel(value, lang) : ''}
        onFocus={() => {
          setOpen(true);
          setText('');
          setActive(0);
        }}
        onChange={(event) => {
          setText(event.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={handleKey}
      />
      <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      {open && (
        <ul
          role="listbox"
          className="absolute start-0 end-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200 animate-scale-in"
        >
          {items.map((item, index) => (
            <li
              key={item.id ?? 'all'}
              role="option"
              aria-selected={item.id === value}
              onMouseDown={(event) => {
                event.preventDefault();
                pick(item.id);
              }}
              onMouseEnter={() => setActive(index)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition ${
                index === active ? 'bg-primary-50 text-primary-900' : 'text-slate-700'
              } ${item.id === value ? 'font-medium' : ''}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
