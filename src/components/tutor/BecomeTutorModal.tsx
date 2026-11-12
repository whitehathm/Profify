import { useState, type FormEvent } from 'react';
import { useApp } from '@/context/AppContext';
import { CITIES, SUBJECTS } from '@/data/catalog';
import { Button } from '@/components/ui/Button';
import { Field, TextInput, inputClass } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import type { TeachingMode } from '@/types';

interface OnboardingErrors {
  name?: string;
  city?: string;
  subject?: string;
  rate?: string;
  modes?: string;
  bio?: string;
}

export function BecomeTutorModal() {
  const { addTutor, closeModal, lang, notify, t } = useApp();
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [modes, setModes] = useState<TeachingMode[]>([]);
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMode = (mode: TeachingMode) => {
    setModes((current) => current.includes(mode)
      ? current.filter((value) => value !== mode)
      : [...current, mode]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    const rate = Number(hourlyRate);
    const nextErrors: OnboardingErrors = {};

    if (name.trim().length < 2) nextErrors.name = t('errName');
    if (!CITIES.some((city) => city.id === cityId)) nextErrors.city = t('errTutorCity');
    if (!SUBJECTS.some((subject) => subject.id === subjectId)) nextErrors.subject = t('errTutorSubject');
    if (!Number.isInteger(rate) || rate < 10 || rate > 2000) nextErrors.rate = t('errTutorRate');
    if (modes.length === 0) nextErrors.modes = t('errModes');
    if (bio.trim().length < 20) nextErrors.bio = t('errTutorBio');

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const subject = SUBJECTS.find((item) => item.id === subjectId);
    if (!subject) return;

    setIsSubmitting(true);
    try {
      const tutor = await addTutor({
        name: name.trim(),
        headline: subject.label,
        avatar: '',
        cityId,
        subjectIds: [subjectId],
        pricePerHour: rate,
        rating: 0,
        reviewCount: 0,
        verified: false,
        published: true,
        modes,
        experienceYears: 0,
        bio: { ar: bio.trim(), fr: bio.trim(), en: bio.trim() },
        qualifications: [],
        availableDays: [0, 1, 2, 3, 4, 5, 6],
        slots: ['10:00', '14:00', '18:00'],
        phone: '',
        reviews: [],
      });
      if (!tutor) {
        setSubmitError(t('tutorSaveFailed'));
        return;
      }
      notify(t('tutorProfileSaved'));
      closeModal();
    } catch {
      setSubmitError(t('tutorSaveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={t('becomeTutorTitle')}
      onClose={closeModal}
      size="lg"
      footer={(
        <Button type="submit" form="become-tutor-form" block disabled={isSubmitting}>
          {t('submitTutorProfile')}
        </Button>
      )}
    >
      <form id="become-tutor-form" onSubmit={handleSubmit} noValidate className="space-y-5">
        {submitError && <p role="alert" className="text-sm text-error-600">{submitError}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('fieldName')} error={errors.name}>
            <TextInput
              value={name}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label={t('fieldCity')} error={errors.city}>
            <select value={cityId} onChange={(event) => setCityId(event.target.value)} className={`${inputClass} bg-white`}>
              <option value="">{t('chooseTutorCity')}</option>
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>{city.label[lang]}</option>
              ))}
            </select>
          </Field>
          <Field label={t('fieldSubject')} error={errors.subject}>
            <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className={`${inputClass} bg-white`}>
              <option value="">{t('chooseTutorSubject')}</option>
              {SUBJECTS.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.label[lang]}</option>
              ))}
            </select>
          </Field>
          <Field label={`${t('priceLabel')} (${t('currency')})`} error={errors.rate}>
            <TextInput
              type="number"
              min={10}
              max={2000}
              step={1}
              inputMode="numeric"
              dir="ltr"
              value={hourlyRate}
              onChange={(event) => setHourlyRate(event.target.value)}
            />
          </Field>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium text-primary-950">{t('modesLabel')}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(['online', 'in_person'] as const).map((mode) => (
              <label key={mode} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-primary-950 transition hover:border-primary-300">
                <input
                  type="checkbox"
                  checked={modes.includes(mode)}
                  onChange={() => toggleMode(mode)}
                  className="h-4 w-4 accent-[#6366F1]"
                />
                {t(mode === 'online' ? 'modeOnline' : 'modeInPerson')}
              </label>
            ))}
          </div>
          {errors.modes && <p role="alert" className="text-sm text-error-600">{errors.modes}</p>}
        </fieldset>

        <Field label={t('bioLabel')} error={errors.bio} hint={t('bioLanguageHint')}>
          <textarea
            rows={4}
            maxLength={500}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className={`${inputClass} min-h-28 resize-y`}
          />
        </Field>
      </form>
    </Modal>
  );
}
