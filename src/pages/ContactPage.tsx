import { useState, type FormEvent } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Field, inputClass } from '@/components/ui/Field';

const SUPPORT_EMAIL = 'hello@profify.ma';
const SUPPORT_WHATSAPP_URL = 'https://wa.me/212600000000';

export function ContactPage() {
  const { t, notify } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notify(t('contactSent'));
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary-950 sm:text-4xl">{t('contactPageTitle')}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{t('contactSubtitle')}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="flex flex-col gap-4">
            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-3xl border border-secondary-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-primary-950">
                <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-bold text-primary-950">{t('contactWhatsapp')}</span>
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-4 rounded-3xl border border-secondary-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-950">
                <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-bold text-primary-950">{t('contactEmail')}</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-secondary-200 bg-white p-6 shadow-card sm:p-8">
            <Field label={t('contactName')}>
              <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required />
            </Field>
            <Field label={t('contactEmailField')}>
              <input type="email" className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} required />
            </Field>
            <Field label={t('contactMessage')}>
              <textarea className={`${inputClass} min-h-32 resize-y`} value={message} onChange={(event) => setMessage(event.target.value)} required />
            </Field>
            <Button type="submit" size="lg" block className="rounded-full bg-primary-950 text-white hover:bg-primary-900">
              {t('contactSend')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
