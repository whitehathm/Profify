import { useState, type FormEvent } from 'react';
import type { TeachingMode } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Segmented } from '@/components/ui/Segmented';
import { ModeTag } from '@/components/ui/Badges';
import { Field, TextInput } from '@/components/ui/Field';
import { AvailabilityCalendar } from '@/components/tutor/AvailabilityCalendar';
import { isValidMoroccanPhone } from '@/lib/format';
import { CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  tutorId: string;
  initialDate?: string;
  initialTime?: string;
}

interface BookingErrors {
  slot?: string;
  name?: string;
  phone?: string;
}

export function BookingModal({ tutorId, initialDate, initialTime }: BookingModalProps) {
  const { tutors, user, t, lang, addBooking, notify, closeModal } = useApp();
  const tutor = tutors.find((item) => item.id === tutorId);
  const [date, setDate] = useState<string | null>(initialDate ?? null);
  const [time, setTime] = useState<string | null>(initialTime ?? null);
  const [mode, setMode] = useState<TeachingMode>(tutor?.modes[0] ?? 'online');
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sent, setSent] = useState(false);

  if (!tutor) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: BookingErrors = {};
    if (!date || !time) nextErrors.slot = t('errSlot');
    if (name.trim().length < 2) nextErrors.name = t('errName');
    if (!isValidMoroccanPhone(phone)) nextErrors.phone = t('errPhone');
    if (!date || !time || Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    addBooking({ tutorId: tutor.id, studentName: name.trim(), studentPhone: phone.trim(), date, time, mode });
    notify(t('toastBooked'));
    setSent(true);
  };

  if (sent) {
    return (
      <Modal title={t('requestSentTitle')} onClose={closeModal}>
        <div className="flex flex-col items-center py-6 text-center animate-scale-in">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </span>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-700">{t('requestSentText', { name: tutor.name })}</p>
          <Button className="mt-6" onClick={closeModal}>
            {t('done')}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={t('bookTitle', { name: tutor.name })}
      onClose={closeModal}
      size="lg"
      footer={
        <Button type="submit" form="booking-form" block>
          {t('sendRequest')}
        </Button>
      }
    >
      <form id="booking-form" onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-semibold text-primary-950">{t('bookDay')} & {t('bookTime')}</p>
          <AvailabilityCalendar
            tutor={tutor}
            date={date}
            time={time}
            onDateChange={(next) => {
              setDate(next);
              setErrors((previous) => ({ ...previous, slot: undefined }));
            }}
            onTimeChange={(next) => {
              setTime(next);
              setErrors((previous) => ({ ...previous, slot: undefined }));
            }}
          />
          {errors.slot && <p className="mt-2 text-sm text-error-600">{errors.slot}</p>}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-primary-950">{t('sessionMode')}</p>
          {tutor.modes.length > 1 ? (
            <Segmented
              label={t('sessionMode')}
              value={mode}
              onChange={setMode}
              options={tutor.modes.map((item) => ({
                value: item,
                label: t(item === 'online' ? 'modeOnline' : 'modeInPerson'),
              }))}
            />
          ) : (
            <ModeTag mode={mode} />
          )}
        </div>

        <Field label={t('fieldName')} error={errors.name}>
          <TextInput
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            lang={lang}
          />
        </Field>

        <Field label={t('fieldPhone')} error={errors.phone} hint={t('phoneHint')}>
          <TextInput
            value={phone}
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="06XXXXXXXX"
            onChange={(event) => setPhone(event.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}
