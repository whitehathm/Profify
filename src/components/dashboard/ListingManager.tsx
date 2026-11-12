import { useMemo, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { TeachingMode, Tutor } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, inputClass } from '@/components/ui/Field';
import { formatWeekday } from '@/lib/format';
import { PRICE_MAX, PRICE_MIN } from '@/lib/tutorFilters';

interface ListingManagerProps {
  tutor: Tutor;
}

const MODE_OPTIONS: TeachingMode[] = ['online', 'in_person'];
const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0];

export function ListingManager({ tutor }: ListingManagerProps) {
  const { t, lang, updateTutor, notify } = useApp();
  const [price, setPrice] = useState(String(tutor.pricePerHour));
  const [bio, setBio] = useState(tutor.bio[lang]);
  const [modes, setModes] = useState<TeachingMode[]>(tutor.modes);
  const [days, setDays] = useState<number[]>(tutor.availableDays);
  const [errors, setErrors] = useState<{ modes?: string; days?: string; price?: string }>({});

  const savedSnapshot = useMemo(
    () => JSON.stringify({ price: tutor.pricePerHour, bio: tutor.bio[lang], modes: tutor.modes, days: tutor.availableDays }),
    [tutor, lang],
  );
  const draftSnapshot = JSON.stringify({ price: Number(price), bio, modes, days });
  const dirty = savedSnapshot !== draftSnapshot;

  const toggle = <T,>(list: T[], item: T): T[] => (list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

  const discard = () => {
    setPrice(String(tutor.pricePerHour));
    setBio(tutor.bio[lang]);
    setModes(tutor.modes);
    setDays(tutor.availableDays);
    setErrors({});
  };

  const save = () => {
    const priceNumber = Number(price);
    const nextErrors: typeof errors = {};
    if (!Number.isFinite(priceNumber) || priceNumber < PRICE_MIN || priceNumber > PRICE_MAX) nextErrors.price = `${PRICE_MIN}-${PRICE_MAX}`;
    if (modes.length === 0) nextErrors.modes = t('errModes');
    if (days.length === 0) nextErrors.days = t('errDays');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateTutor(tutor.id, {
      pricePerHour: priceNumber,
      bio: { ...tutor.bio, [lang]: bio.trim() },
      modes,
      availableDays: days,
    });
    notify(t('toastListingSaved'));
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary-950">{t('listingTitle')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('listingSubtitle')}</p>
        </div>
        {dirty && (
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 ring-1 ring-primary-100 animate-scale-in">
            {t('unsavedChanges')}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <Field label={t('priceLabel')} error={errors.price}>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={PRICE_MIN}
              max={PRICE_MAX}
              dir="ltr"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className={`${inputClass} pe-16`}
            />
            <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">{t('currency')}</span>
          </div>
        </Field>

        <Field label={t('bioLabel')}>
          <textarea
            rows={4}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-primary-950">{t('modesLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {MODE_OPTIONS.map((mode) => (
              <Chip key={mode} active={modes.includes(mode)} onClick={() => setModes((previous) => toggle(previous, mode))}>
                {t(mode === 'online' ? 'modeOnline' : 'modeInPerson')}
              </Chip>
            ))}
          </div>
          {errors.modes && <p className="mt-2 text-sm text-error-600">{errors.modes}</p>}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-primary-950">{t('daysLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map((day) => (
              <Chip key={day} active={days.includes(day)} onClick={() => setDays((previous) => toggle(previous, day))}>
                {formatWeekday(day, lang)}
              </Chip>
            ))}
          </div>
          {errors.days && <p className="mt-2 text-sm text-error-600">{errors.days}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} onClick={discard} disabled={!dirty}>
          {t('discard')}
        </Button>
        <Button icon={<Check className="h-4 w-4" />} onClick={save} disabled={!dirty}>
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
}
