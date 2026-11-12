import { useState, type FormEvent } from 'react';
import { CheckCircle2, MapPin, Video } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AvailabilityCalendar } from '@/components/tutor/AvailabilityCalendar';
import { Button } from '@/components/ui/Button';
import { Field, TextInput } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { formatNumber, isValidMoroccanPhone } from '@/lib/format';
import type { TeachingMode } from '@/types';

interface BookingModalProps {
  tutorId: string;
  initialDate?: string;
  initialTime?: string;
}

interface BookingErrors {
  name?: string;
  phone?: string;
  slot?: string;
}

export function BookingModal({ tutorId, initialDate, initialTime }: BookingModalProps) {
  const { tutors, user, t, addBooking, notify, closeModal } = useApp();
  const tutor = tutors.find((item) => item.id === tutorId);
  const [date, setDate] = useState<string | null>(initialDate ?? null);
  const [time, setTime] = useState<string | null>(initialTime ?? null);
  const [mode, setMode] = useState<TeachingMode>(tutor?.modes[0] ?? 'online');
  const [studentName, setStudentName] = useState(user?.name ?? '');
  const [studentPhone, setStudentPhone] = useState('');
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (!tutor) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: BookingErrors = {};
    if (studentName.trim().length < 2) nextErrors.name = t('errName');
    if (!isValidMoroccanPhone(studentPhone)) nextErrors.phone = t('errPhone');
    if (!date || !time) nextErrors.slot = t('errSlot');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !date || !time) return;

    addBooking({
      tutorId: tutor.id,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      date,
      time,
      mode,
    });
    notify(t('toastBooked'));
    setSubmitted(true);
  };

  const footer = submitted ? (
    <Button block onClick={closeModal}>
      {t('done')}
    </Button>
  ) : (
    <Button type="submit" form="booking-form" block>
      {t('sendRequest')}
    </Button>
  );

  return (
    <Modal title={t('bookTitle', { name: tutor.name })} onClose={closeModal} footer={footer} size="lg">
      {submitted ? (
        <div role="status" aria-live="polite" className="space-y-3 py-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success-600" aria-hidden="true" />
          <h3 className="text-lg font-bold text-primary-950">{t('requestSentTitle')}</h3>
          <p className="text-sm text-slate-600">{t('requestSentText', { name: tutor.name })}</p>
        </div>
      ) : (
        <form id="booking-form" onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <img src={tutor.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-primary-950">{tutor.name}</p>
              <p className="text-sm font-bold text-primary-700">
                {formatNumber(tutor.pricePerHour)} {t('currency')} {t('perHour')}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-primary-950">{t('sessionMode')}</p>
            <div role="radiogroup" aria-label={t('sessionMode')} className="grid grid-cols-2 gap-2">
              {tutor.modes.map((availableMode) => {
                const Icon = availableMode === 'online' ? Video : MapPin;
                const label = t(availableMode === 'online' ? 'modeOnline' : 'modeInPerson');
                return (
                  <button
                    key={availableMode}
                    type="button"
                    role="radio"
                    aria-checked={mode === availableMode}
                    onClick={() => setMode(availableMode)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      mode === availableMode
                        ? 'border-primary-500 bg-primary-50 text-primary-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <AvailabilityCalendar
              tutor={tutor}
              date={date}
              time={time}
              onDateChange={setDate}
              onTimeChange={setTime}
            />
            {errors.slot && <p role="alert" className="mt-2 text-sm text-error-600">{errors.slot}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('fieldName')} error={errors.name}>
              <TextInput
                value={studentName}
                autoComplete="name"
                onChange={(event) => setStudentName(event.target.value)}
              />
            </Field>
            <Field label={t('fieldPhone')} error={errors.phone} hint={t('phoneHint')}>
              <TextInput
                value={studentPhone}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="06XXXXXXXX"
                onChange={(event) => setStudentPhone(event.target.value)}
              />
            </Field>
          </div>
        </form>
      )}
    </Modal>
  );
}
