import { useState, type FormEvent } from 'react';
import { Check, Copy, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, TextInput, inputClass } from '@/components/ui/Field';
import { isValidMoroccanPhone } from '@/lib/format';

interface ContactModalProps {
  tutorId: string;
}

interface ContactErrors {
  name?: string;
  phone?: string;
}

export function ContactModal({ tutorId }: ContactModalProps) {
  const { tutors, t, notify, closeModal } = useApp();
  const tutor = tutors.find((item) => item.id === tutorId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!tutor) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: ContactErrors = {};
    if (name.trim().length < 2) nextErrors.name = t('errName');
    if (!isValidMoroccanPhone(phone)) nextErrors.phone = t('errPhone');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setRevealed(true);
    notify(t('toastContactRevealed'));
  };

  const digits = tutor.phone.replace(/\D/g, '');
  const whatsappHref = `https://wa.me/${digits.startsWith('212') ? digits : `212${digits.replace(/^0/, '')}`}`;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(tutor.phone);
      setCopied(true);
      notify(t('toastCopied'));
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal
      title={t('contactTitle', { name: tutor.name })}
      onClose={closeModal}
      footer={
        revealed ? (
          <Button variant="outline" block onClick={closeModal}>
            {t('done')}
          </Button>
        ) : (
          <Button type="submit" form="contact-form" block>
            {t('revealContact')}
          </Button>
        )
      }
    >
      {revealed ? (
        <div className="space-y-5 animate-scale-in">
          <div className="rounded-2xl bg-primary-50 p-5 ring-1 ring-primary-100">
            <p className="text-sm font-medium text-primary-800">{t('contactRevealed')}</p>
            <p dir="ltr" className="mt-2 text-2xl font-bold tracking-wide text-primary-950">
              {tutor.phone}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href={`tel:${tutor.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {t('callNow')}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-success-500 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-success-600 active:translate-y-0 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <Button variant="outline" icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} onClick={copyNumber}>
              {copied ? t('copied') : t('copyNumber')}
            </Button>
          </div>
        </div>
      ) : (
        <form id="contact-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          <p className="text-sm leading-relaxed text-slate-600">{t('contactText')}</p>
          <Field label={t('fieldName')} error={errors.name}>
            <TextInput value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} />
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
          <Field label={t('messageLabel')}>
            <textarea
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </form>
      )}
    </Modal>
  );
}
