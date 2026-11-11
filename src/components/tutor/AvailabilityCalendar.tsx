import { useMemo } from 'react';
import { nextDays, toISODate, formatDate } from '@/lib/format';
import type { Tutor } from '@/types';
import { useApp } from '@/context/AppContext';

interface AvailabilityCalendarProps {
  tutor: Tutor;
  date: string | null;
  time: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string | null) => void;
}

export function AvailabilityCalendar({ tutor, date, time, onDateChange, onTimeChange }: AvailabilityCalendarProps) {
  const { t, lang } = useApp();
  const days = useMemo(() => nextDays(14), []);

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {days.map((day) => {
          const iso = toISODate(day);
          const available = tutor.availableDays.includes(day.getDay());
          const active = iso === date;
          const isToday = iso === toISODate(new Date());
          return (
            <button
              key={iso}
              type="button"
              disabled={!available}
              aria-pressed={active}
              onClick={() => {
                onDateChange(iso);
                onTimeChange(null);
              }}
              className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition duration-200 ${
                active
                  ? 'border-primary-700 bg-primary-700 text-white shadow-md'
                  : available
                    ? 'border-slate-200 bg-white text-primary-950 hover:-translate-y-0.5 hover:border-primary-300'
                    : 'border-transparent bg-slate-100 text-slate-500 line-through'
              }`}
            >
              <span className="text-xs font-medium">{isToday ? t('today') : formatDate(iso, lang, { weekday: 'short' })}</span>
              <span className="mt-1 text-lg font-bold">{day.getDate()}</span>
              {available && !active && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success-500" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        {!date ? (
          <p className="text-sm text-slate-600">{t('chooseDay')}</p>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-primary-950">{t('chooseTime')}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {tutor.slots.map((slot) => {
                const active = slot === time;
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onTimeChange(slot)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition duration-200 ${
                      active
                        ? 'border-accent-400 bg-accent-400 text-primary-950 shadow-sm'
                        : 'border-slate-200 bg-white text-primary-900 hover:border-primary-300'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
