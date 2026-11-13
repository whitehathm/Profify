import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clock,
  Copy,
  Globe,
  Lock,
  MailCheck,
  MessageCircle,
  Minus,
  Monitor,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { CITIES, EXPERIENCE_BANDS, SPECIALTIES, SUBJECTS, cityLabel, subjectLabel } from '@/data/catalog';
import {
  clearPendingTutorOnboarding,
  getPendingTutorOnboardingEmail,
  markPendingTutorOnboarding,
  useApp,
} from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Field, TextInput, inputClass } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber, isValidEmail } from '@/lib/format';
import {
  compressImageFile,
  formatMoroccoWhatsapp,
  isValidMoroccoWhatsapp,
  saveTutorExtras,
  submitTutorApplication,
} from '@/lib/tutorExtras';
import { supabase } from '@/lib/supabase';
import type { ExperienceBand, SpecialtyId, TeachingMode, Tutor } from '@/types';

const TOTAL_STEPS = 6;
const MIN_RATE = 50;
const MAX_RATE = 600;

export function TutorOnboardingWizard() {
  const {
    lang,
    t,
    user,
    loginWithPassword,
    registerWithPassword,
    resendVerificationEmail,
    closeTutorWizard,
    addTutor,
    setRole,
    notify,
  } = useApp();

  // Auth Gate & Email Verification state
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState(() => getPendingTutorOnboardingEmail());
  const [authPassword, setAuthPassword] = useState('');
  const [authErrors, setAuthErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [authFormError, setAuthFormError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>(() =>
    getPendingTutorOnboardingEmail(),
  );
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  // Wizard step & form state
  const [step, setStep] = useState(1);
  const [primaryLanguage, setPrimaryLanguage] = useState<string>('english');
  const [specialties, setSpecialties] = useState<SpecialtyId[]>(['conversation']);
  const [modes, setModes] = useState<TeachingMode[]>(['online']);
  const [cityId, setCityId] = useState<string>('casablanca');
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [offersFreeTrial, setOffersFreeTrial] = useState<boolean>(true);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [experienceBand, setExperienceBand] = useState<ExperienceBand>('3-5');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsappDigits, setWhatsappDigits] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTutor, setSubmittedTutor] = useState<Tutor | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string; password?: string } = {};
    if (authMode === 'register' && authName.trim().length < 2) nextErrors.name = t('errName');
    if (!isValidEmail(authEmail)) nextErrors.email = t('errEmail');
    if (authPassword.length < 6) nextErrors.password = t('errPassword');
    setAuthErrors(nextErrors);
    setAuthFormError(null);
    setResendFeedback(null);
    if (Object.keys(nextErrors).length > 0) return;

    setAuthSubmitting(true);
    try {
      const cleanEmail = authEmail.trim().toLowerCase();
      const displayName = authName.trim() || cleanEmail.split('@')[0];
      const result = authMode === 'login'
        ? await loginWithPassword(cleanEmail, authPassword)
        : await registerWithPassword(displayName, cleanEmail, authPassword);

      if (result.error) {
        setAuthFormError(result.errorMessage || t(result.error));
        return;
      }

      if (result.needsEmailVerification || result.needsEmailConfirmation) {
        const targetEmail = result.email || cleanEmail;
        markPendingTutorOnboarding(targetEmail);
        setPendingVerificationEmail(targetEmail);
        return;
      }

      clearPendingTutorOnboarding();
      setPendingVerificationEmail('');
      if (authName.trim() && !firstName) {
        const [first, ...rest] = authName.trim().split(/\s+/);
        setFirstName(first);
        if (rest.length > 0) setLastName(rest.join(' '));
      }
      notify(t('toastWelcome', { name: displayName }));
    } catch {
      setAuthFormError(t('authUnexpected'));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = pendingVerificationEmail || user?.email || authEmail.trim().toLowerCase();
    if (!targetEmail) return;
    setResendingEmail(true);
    setAuthFormError(null);
    setResendFeedback(null);
    try {
      const result = await resendVerificationEmail(targetEmail);
      if (result.error) {
        setAuthFormError(result.errorMessage || t(result.error));
      } else {
        setResendFeedback(t('verificationResentToast'));
        notify(t('verificationResentToast'));
      }
    } finally {
      setResendingEmail(false);
    }
  };

  const handleCheckVerifiedAndLogin = async () => {
    setAuthFormError(null);
    setResendFeedback(null);
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email_confirmed_at) {
          clearPendingTutorOnboarding();
          setPendingVerificationEmail('');
          return;
        }
      } catch {
        // Fall through to login form.
      }
    }
    const savedEmail = pendingVerificationEmail || user?.email || authEmail;
    if (savedEmail) setAuthEmail(savedEmail);
    setPendingVerificationEmail('');
    setAuthMode('login');
  };

  const toggleSpecialty = (id: SpecialtyId) => {
    setStepError(null);
    setSpecialties((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleMode = (mode: TeachingMode) => {
    setStepError(null);
    setModes((prev) => (prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode]));
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 360);
      setAvatarPreview(compressed);
      setStepError(null);
    } catch {
      setStepError(t('tutorSaveFailed'));
    }
  };

  const validateCurrentStep = (): boolean => {
    setStepError(null);
    if (step === 1) {
      if (!primaryLanguage) {
        setStepError(t('errTutorSubject'));
        return false;
      }
      if (specialties.length === 0) {
        setStepError(t('errSpecialties'));
        return false;
      }
    }
    if (step === 2) {
      if (modes.length === 0) {
        setStepError(t('errModes'));
        return false;
      }
      if (modes.includes('in_person') && !cityId) {
        setStepError(t('errTutorCity'));
        return false;
      }
    }
    if (step === 3) {
      if (!Number.isFinite(hourlyRate) || hourlyRate < MIN_RATE || hourlyRate > 2000) {
        setStepError(t('errTutorRate'));
        return false;
      }
    }
    if (step === 4) {
      if (headline.trim().length < 6) {
        setStepError(t('errHeadline'));
        return false;
      }
      if (bio.trim().length < 20) {
        setStepError(t('errTutorBio'));
        return false;
      }
    }
    if (step === 6) {
      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        setStepError(t('errName'));
        return false;
      }
      if (!isValidMoroccoWhatsapp(whatsappDigits)) {
        setStepError(t('errWhatsapp'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
  };

  const handleBack = () => {
    setStepError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCurrentStep() || !user) return;

    setSubmitting(true);
    setStepError(null);

    const expBandMeta = EXPERIENCE_BANDS.find((band) => band.id === experienceBand) ?? EXPERIENCE_BANDS[1];
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanHeadline = headline.trim();
    const cleanBio = bio.trim();
    const formattedWhatsapp = formatMoroccoWhatsapp(whatsappDigits);
    const resolvedCity = modes.includes('in_person') ? cityId : (cityId || 'casablanca');

    try {
      const created = await addTutor({
        name: cleanFirst,
        firstName: cleanFirst,
        lastName: cleanLast,
        headline: { ar: cleanHeadline, fr: cleanHeadline, en: cleanHeadline },
        avatar: avatarPreview,
        cityId: resolvedCity,
        subjectIds: [primaryLanguage],
        specialties,
        pricePerHour: hourlyRate,
        offersFreeTrial,
        rating: 0,
        reviewCount: 0,
        verified: false,
        published: false,
        modes,
        experienceYears: expBandMeta.years,
        experienceBand,
        bio: { ar: cleanBio, fr: cleanBio, en: cleanBio },
        qualifications: specialties.map((id) => SPECIALTIES.find((item) => item.id === id)?.label ?? { ar: id, fr: id, en: id }),
        availableDays: [1, 2, 3, 4, 5, 6],
        slots: ['10:00', '14:00', '18:00'],
        phone: formattedWhatsapp,
        reviews: [],
      });

      if (!created) {
        setStepError(t('tutorSaveFailed'));
        return;
      }

      saveTutorExtras(created.id, {
        firstName: cleanFirst,
        lastName: cleanLast,
        whatsapp: formattedWhatsapp,
        specialties,
        offersFreeTrial,
        experienceBand,
      });

      await submitTutorApplication({
        tutorId: created.id,
        userId: user.id,
        firstName: cleanFirst,
        lastName: cleanLast,
        whatsapp: formattedWhatsapp,
        primaryLanguage,
        specialties,
        modes,
        cityId: resolvedCity,
        pricePerHour: hourlyRate,
        offersFreeTrial,
        headline: cleanHeadline,
        bio: cleanBio,
        experienceBand,
        avatarUrl: avatarPreview,
        createdAt: new Date().toISOString(),
      });

      setSubmittedTutor(created);
      notify(t('tutorProfileSaved'));
    } catch {
      setStepError(t('tutorSaveFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  // 1A. Email Verification Pending Screen
  const activePendingEmail = pendingVerificationEmail || (user && !user.emailConfirmed ? user.email : '');
  if ((!user || !user.emailConfirmed) && activePendingEmail) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/70 via-white to-white px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-secondary-200 bg-white p-6 text-center shadow-card sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
              <MailCheck className="h-7 w-7" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">
              {t('verifyEmailTitle')}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {t('verifyEmailBody', { email: activePendingEmail })}
            </p>

            {resendFeedback && (
              <p role="status" className="mt-4 rounded-xl bg-success-50 px-3.5 py-2.5 text-xs font-semibold text-success-700">
                {resendFeedback}
              </p>
            )}

            {authFormError && (
              <p role="alert" className="mt-4 rounded-xl bg-error-50 px-3.5 py-2.5 text-xs font-semibold text-error-700">
                {authFormError}
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                block
                className="min-h-[44px] bg-primary-950 text-white"
                onClick={handleCheckVerifiedAndLogin}
              >
                {t('verifiedLoginBtn')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                block
                disabled={resendingEmail}
                className="min-h-[44px]"
                icon={<RefreshCw className={`h-4 w-4 ${resendingEmail ? 'animate-spin' : ''}`} aria-hidden="true" />}
                onClick={handleResendVerification}
              >
                {t('resendVerificationBtn')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 1B. Auth Gate Screen
  if (!user || !user.emailConfirmed) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/70 via-white to-white px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={closeTutorWizard}
            className="mb-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-primary-950"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            <span>{t('backToBenefits')}</span>
          </button>

          <div className="mb-6 text-center">
            <p className="text-xs font-semibold tracking-wide text-primary-700">{t('authGateBadge')}</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-primary-950 sm:text-3xl">
              {t('authGateTitle')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('authGateSubtitle')}</p>
          </div>

          <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-6 flex justify-center">
              <Segmented
                label={t('login')}
                value={authMode}
                onChange={(next) => {
                  setAuthMode(next);
                  setAuthErrors({});
                  setAuthFormError(null);
                }}
                options={[
                  { value: 'register', label: t('register') },
                  { value: 'login', label: t('login') },
                ]}
              />
            </div>

            <form onSubmit={handleAuthSubmit} noValidate className="space-y-4">
              {authMode === 'register' && (
                <Field label={t('fieldName')} error={authErrors.name}>
                  <TextInput
                    value={authName}
                    autoComplete="name"
                    onChange={(event) => setAuthName(event.target.value)}
                  />
                </Field>
              )}
              <Field label={t('fieldEmail')} error={authErrors.email}>
                <TextInput
                  type="email"
                  dir="ltr"
                  value={authEmail}
                  autoComplete="email"
                  onChange={(event) => setAuthEmail(event.target.value)}
                />
              </Field>
              <Field label={t('fieldPassword')} error={authErrors.password}>
                <TextInput
                  type="password"
                  dir="ltr"
                  value={authPassword}
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  onChange={(event) => setAuthPassword(event.target.value)}
                />
              </Field>

              {authFormError && (
                <p role="alert" className="rounded-xl bg-error-50 px-3.5 py-2.5 text-sm font-medium text-error-700">
                  {authFormError}
                </p>
              )}

              <Button type="submit" variant="accent" size="lg" block disabled={authSubmitting}>
                {authMode === 'register' ? t('register') : t('login')}
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // 2. Post-Submission Celebratory Screen
  if (submittedTutor) {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://profify.ma'}/?tutor=${encodeURIComponent(submittedTutor.id)}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${t('shareWhatsappMsg')} ${shareUrl}`)}`;
    const primarySubj = subjectLabel(submittedTutor.subjectIds[0] ?? 'english', lang);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        notify(t('linkCopied'));
        window.setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        notify(t('linkCopied'));
      }
    };

    return (
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/70 via-white to-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl space-y-6 animate-slide-up">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-sm">
              <Sparkles className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary-950 sm:text-3xl">
              {t('wizardSuccessTitle')}
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
              {t('wizardSuccessSubtitle')}
            </p>
          </div>

          <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar src={submittedTutor.avatar} name={submittedTutor.name} size="lg" />
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-700 ring-1 ring-warning-100">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('pendingQualityReview')}
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-primary-950">{submittedTutor.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {primarySubj}
                    {' · '}
                    {submittedTutor.modes.map((m) => t(m === 'online' ? 'modeOnline' : 'modeInPerson')).join(' / ')}
                    {submittedTutor.modes.includes('in_person') ? ` · ${cityLabel(submittedTutor.cityId, lang)}` : ''}
                  </p>
                </div>
              </div>
              <div className="text-end tabular-nums">
                <p className="text-2xl font-extrabold text-primary-950">
                  {formatNumber(submittedTutor.pricePerHour)} <span className="text-sm font-semibold text-slate-600">{t('currency')}</span>
                </p>
                <p className="text-xs text-slate-500">{t('perHour')}</p>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-primary-950">{submittedTutor.headline[lang]}</p>
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600">{submittedTutor.bio[lang]}</p>

            {offersFreeTrial && (
              <div className="mt-4 flex items-center gap-2 border-t border-secondary-200 pt-3 text-xs font-semibold text-success-700">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>{t('wizardFreeTrialLabel')}</span>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-secondary-200 bg-secondary-50/70 p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 ring-1 ring-secondary-200">
                <Share2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-primary-950">{t('shareInviteTitle')}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{t('shareInviteHint')}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-3 py-2">
              <input
                type="text"
                readOnly
                dir="ltr"
                value={shareUrl}
                aria-label={t('copyShareLink')}
                className="min-w-0 flex-1 bg-transparent text-xs text-slate-600 focus:outline-none"
              />
              <Button size="sm" variant="outline" onClick={handleCopy} icon={copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
                {copiedLink ? t('copied') : t('copyShareLink')}
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-success-500/30 bg-success-50 px-5 py-2.5 text-sm font-bold text-success-700 transition hover:bg-success-100"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t('shareWhatsapp')}
              </a>
              <Button
                variant="primary"
                size="lg"
                className="flex-1 bg-primary-950 text-white"
                onClick={() => setRole('tutor')}
              >
                {t('goToTutorDashboard')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. 6-Step Onboarding Wizard
  const progressPercent = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-white px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress Header */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{t('wizardStepCounter', { step: formatNumber(step), total: formatNumber(TOTAL_STEPS) })}</span>
            <span className="tabular-nums text-primary-700">{progressPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            className="h-2 w-full overflow-hidden rounded-full bg-secondary-100"
          >
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={step === TOTAL_STEPS ? handleSubmitApplication : (e) => { e.preventDefault(); handleNext(); }}
          noValidate
          className="rounded-3xl border border-secondary-200 bg-white p-5 shadow-card sm:p-8"
        >
          {/* Step 1: Primary Language & Specialties */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('wizardStep1Title')}</h1>
                <p className="mt-1.5 text-sm text-slate-600">{t('wizardStep1Subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {SUBJECTS.map((subject) => {
                  const active = primaryLanguage === subject.id;
                  return (
                    <button
                      key={subject.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setPrimaryLanguage(subject.id);
                        setStepError(null);
                      }}
                      className={`flex min-h-[56px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-start transition ${
                        active
                          ? 'border-primary-500 bg-primary-50 text-primary-950 ring-2 ring-primary-500/20'
                          : 'border-secondary-200 bg-white text-slate-700 hover:border-primary-300'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                          active ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-primary-950'
                        }`}
                      >
                        {subject.code}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-primary-950">{subject.label[lang]}</p>
                        <p className="truncate text-xs text-slate-500">{subject.native}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-primary-950">{t('wizardSpecialtiesLabel')}</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {SPECIALTIES.map((specialty) => {
                    const selected = specialties.includes(specialty.id);
                    return (
                      <button
                        key={specialty.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleSpecialty(specialty.id)}
                        className={`flex min-h-[60px] items-start justify-between gap-3 rounded-2xl border p-3.5 text-start transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50/80 text-primary-950'
                            : 'border-secondary-200 bg-white text-slate-700 hover:border-primary-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-primary-950">{specialty.label[lang]}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{specialty.hint[lang]}</p>
                        </div>
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            selected
                              ? 'border-primary-500 bg-primary-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Teaching Format & Moroccan City */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('wizardStep2Title')}</h1>
                <p className="mt-1.5 text-sm text-slate-600">{t('wizardStep2Subtitle')}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      id: 'online' as const,
                      icon: Monitor,
                      title: t('modeOnline'),
                      desc: t('wizardOnlineDesc'),
                    },
                    {
                      id: 'in_person' as const,
                      icon: Users,
                      title: t('modeInPerson'),
                      desc: t('wizardInPersonDesc'),
                    },
                  ]
                ).map(({ id, icon: Icon, title, desc }) => {
                  const selected = modes.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleMode(id)}
                      className={`flex min-h-[112px] flex-col items-start justify-between rounded-2xl border p-4 text-start transition ${
                        selected
                          ? 'border-primary-500 bg-primary-50/80 ring-2 ring-primary-500/20'
                          : 'border-secondary-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            selected ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-primary-950'
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-base font-bold text-primary-950">{title}</p>
                        <p className="mt-0.5 text-xs text-slate-600">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {modes.includes('in_person') && (
                <div className="pt-2">
                  <Field label={t('fieldCity')}>
                    <select
                      value={cityId}
                      onChange={(event) => {
                        setCityId(event.target.value);
                        setStepError(null);
                      }}
                      className={`${inputClass} bg-white`}
                    >
                      <option value="">{t('chooseTutorCity')}</option>
                      {CITIES.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.label[lang]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Hourly Rate & Free 30-min Trial */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('wizardStep3Title')}</h1>
                <p className="mt-1.5 text-sm text-slate-600">{t('wizardStep3Subtitle')}</p>
              </div>

              <div className="rounded-2xl border border-secondary-200 bg-secondary-50/70 p-6 text-center">
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    aria-label="-10 MAD"
                    onClick={() => setHourlyRate((prev) => Math.max(MIN_RATE, prev - 10))}
                    disabled={hourlyRate <= MIN_RATE}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary-200 bg-white text-primary-950 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 disabled:opacity-40"
                  >
                    <Minus className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <div className="min-w-[140px]">
                    <input
                      type="number"
                      min={MIN_RATE}
                      max={MAX_RATE}
                      step={5}
                      dir="ltr"
                      aria-label={t('priceLabel')}
                      value={hourlyRate}
                      onChange={(event) => setHourlyRate(Math.max(0, Number(event.target.value)))}
                      className="w-28 bg-transparent text-center text-4xl font-extrabold tabular-nums text-primary-950 focus:outline-none"
                    />
                    <p className="text-xs font-semibold text-slate-500">{t('wizardRateUnit')}</p>
                  </div>

                  <button
                    type="button"
                    aria-label="+10 MAD"
                    onClick={() => setHourlyRate((prev) => Math.min(MAX_RATE, prev + 10))}
                    disabled={hourlyRate >= MAX_RATE}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary-200 bg-white text-primary-950 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 disabled:opacity-40"
                  >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-medium text-slate-600 ring-1 ring-secondary-200">
                  <Globe className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                  {t('wizardRateTip')}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-secondary-200 bg-white p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary-950">{t('wizardFreeTrialLabel')}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{t('wizardFreeTrialHint')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={offersFreeTrial}
                  aria-label={t('wizardFreeTrialLabel')}
                  onClick={() => setOffersFreeTrial((prev) => !prev)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    offersFreeTrial ? 'bg-primary-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      offersFreeTrial ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'ltr:translate-x-1 rtl:-translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Combined Tutor Pitch */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('wizardStep4Title')}</h1>
                <p className="mt-1.5 text-sm text-slate-600">{t('wizardStep4Subtitle')}</p>
              </div>

              <Field label={t('wizardHeadlineLabel')}>
                <TextInput
                  maxLength={90}
                  value={headline}
                  placeholder={t('wizardHeadlinePlaceholder')}
                  onChange={(event) => {
                    setHeadline(event.target.value);
                    setStepError(null);
                  }}
                />
              </Field>

              <Field label={t('wizardBioLabel')} hint={t('bioLanguageHint')}>
                <textarea
                  rows={4}
                  maxLength={600}
                  value={bio}
                  placeholder={t('wizardBioPlaceholder')}
                  onChange={(event) => {
                    setBio(event.target.value);
                    setStepError(null);
                  }}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </Field>

              <div>
                <p className="mb-2.5 text-sm font-semibold text-primary-950">{t('wizardExperienceLabel')}</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {EXPERIENCE_BANDS.map((band) => {
                    const active = experienceBand === band.id;
                    return (
                      <button
                        key={band.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setExperienceBand(band.id)}
                        className={`min-h-[44px] rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                          active
                            ? 'border-primary-950 bg-primary-950 text-white shadow-sm'
                            : 'border-secondary-200 bg-white text-slate-700 hover:border-primary-300'
                        }`}
                      >
                        {band.label[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Profile Photo Upload + Skip */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('wizardStep5Title')}</h1>
                <p className="mt-1.5 text-sm text-slate-600">{t('wizardStep5Subtitle')}</p>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
              />

              {avatarPreview ? (
                <div className="flex flex-col items-center gap-4 rounded-3xl border border-secondary-200 bg-secondary-50/60 p-6 text-center">
                  <img
                    src={avatarPreview}
                    alt={firstName || 'Tutor'}
                    className="h-32 w-32 rounded-3xl object-cover shadow-sm ring-4 ring-white"
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Camera className="h-4 w-4" />}
                      onClick={() => photoInputRef.current?.click()}
                    >
                      {t('wizardChangePhoto')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => setAvatarPreview('')}
                    >
                      {t('wizardRemovePhoto')}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary-300 bg-primary-50/40 px-6 py-12 text-center transition hover:border-primary-500 hover:bg-primary-50"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm ring-1 ring-primary-100">
                    <Upload className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-4 text-sm font-bold text-primary-950">{t('wizardUploadPrompt')}</span>
                  <span className="mt-1 text-xs text-slate-500">{t('wizardUploadHint')}</span>
                </button>
              )}

              {!avatarPreview && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="min-h-[44px] px-4 text-sm font-semibold text-slate-600 underline-offset-4 hover:text-primary-950 hover:underline"
                  >
                    {t('wizardSkipPhoto')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Name & Moroccan WhatsApp */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('wizardStep6Title')}</h1>
                <p className="mt-1.5 text-sm text-slate-600">{t('wizardStep6Subtitle')}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('firstNameLabel')}>
                  <TextInput
                    value={firstName}
                    autoComplete="given-name"
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      setStepError(null);
                    }}
                  />
                </Field>
                <Field label={t('lastNameLabel')}>
                  <TextInput
                    value={lastName}
                    autoComplete="family-name"
                    onChange={(event) => {
                      setLastName(event.target.value);
                      setStepError(null);
                    }}
                  />
                </Field>
              </div>
              <p className="text-xs text-slate-500">{t('firstNamePublicNote')}</p>

              <Field label={t('whatsappLabel')}>
                <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-100">
                  <span dir="ltr" className="border-e border-slate-200 bg-secondary-50 px-3.5 py-3 text-sm font-bold text-primary-950">
                    +212
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    placeholder="661234567"
                    value={whatsappDigits}
                    onChange={(event) => {
                      setWhatsappDigits(event.target.value);
                      setStepError(null);
                    }}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-primary-950 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </Field>

              <div className="flex items-start gap-2.5 rounded-2xl bg-secondary-50 px-4 py-3 text-xs leading-relaxed text-slate-600 ring-1 ring-secondary-200">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                <span>{t('whatsappPrivateNote')}</span>
              </div>
            </div>
          )}

          {stepError && (
            <p role="alert" className="mt-5 rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-700">
              {stepError}
            </p>
          )}

          {/* Footer Navigation with RTL-mirrored Back/Continue buttons */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-secondary-200 pt-5">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="min-h-[44px]"
                icon={<ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />}
              >
                {t('wizardBack')}
              </Button>
            ) : (
              <span />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="submit"
                variant="primary"
                className="min-h-[44px] bg-primary-950 text-white"
              >
                <span>{t('wizardContinue')}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="accent"
                disabled={submitting}
                className="min-h-[44px]"
              >
                <span>{t('wizardSubmit')}</span>
                <Check className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
