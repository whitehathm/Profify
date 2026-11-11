import { useState, type FormEvent } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Segmented } from '@/components/ui/Segmented';
import { Field, TextInput } from '@/components/ui/Field';
import { isValidEmail } from '@/lib/format';

type AuthMode = 'login' | 'register';

interface AuthErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function AuthModal({ initialMode }: { initialMode: AuthMode }) {
  const { t, signIn, notify, closeModal } = useApp();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthErrors>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: AuthErrors = {};
    if (mode === 'register' && fullName.trim().length < 2) nextErrors.name = t('errName');
    if (!isValidEmail(email)) nextErrors.email = t('errEmail');
    if (password.length < 6) nextErrors.password = t('errPassword');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const name = fullName.trim() || email.trim().split('@')[0];
    signIn({ name, email: email.trim() });
    notify(t('toastWelcome', { name }));
    closeModal();
  };

  return (
    <Modal
      title={mode === 'login' ? t('loginTitle') : t('registerTitle')}
      onClose={closeModal}
      footer={
        <Button type="submit" form="auth-form" block>
          {mode === 'login' ? t('login') : t('register')}
        </Button>
      }
    >
      <div className="space-y-6">
        <Segmented
          label={t('login')}
          value={mode}
          onChange={(next) => {
            setMode(next);
            setErrors({});
          }}
          options={[
            { value: 'login', label: t('login') },
            { value: 'register', label: t('register') },
          ]}
        />

        <form id="auth-form" onSubmit={handleSubmit} noValidate className="space-y-5">
          {mode === 'register' && (
            <Field label={t('fieldName')} error={errors.name}>
              <TextInput value={fullName} autoComplete="name" onChange={(event) => setFullName(event.target.value)} />
            </Field>
          )}
          <Field label={t('fieldEmail')} error={errors.email}>
            <TextInput
              type="email"
              dir="ltr"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field label={t('fieldPassword')} error={errors.password}>
            <TextInput
              type="password"
              dir="ltr"
              value={password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <p className="rounded-xl bg-accent-50 px-4 py-3 text-xs leading-relaxed text-accent-800 ring-1 ring-accent-100">
            {t('authDemoHint')}
          </p>
        </form>
      </div>
    </Modal>
  );
}
