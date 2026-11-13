import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarCheck,
  Camera,
  Check,
  Clock,
  CreditCard,
  FileText,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  UserCog,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  CITIES,
  CURRENT_TUTOR_ID,
  EXPERIENCE_BANDS,
  SPECIALTIES,
  SUBJECTS,
  cityLabel,
  subjectLabel,
} from '@/data/catalog';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field, TextInput, inputClass } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatNumber, formatWeekday, initials } from '@/lib/format';
import {
  DEFAULT_NOTIFICATIONS,
  clearTutorExtras,
  compressImageFile,
  formatMoroccoWhatsapp,
  getTutorExtras,
  isValidMoroccoWhatsapp,
  saveTutorExtras,
  uploadToPrivateBucket,
  type NotificationPrefs,
  type TutorExtras,
  type UploadedDoc,
} from '@/lib/tutorExtras';
import type { ExperienceBand, SpecialtyId, TeachingMode } from '@/types';

type DashboardTab = 'overview' | 'profile';
type ActiveModal =
  | 'general'
  | 'teaching'
  | 'photo'
  | 'diplomas'
  | 'cin'
  | 'notifications'
  | 'delete'
  | null;

const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0];

export function TutorDashboard() {
  const {
    lang,
    t,
    user,
    bookings,
    tutors,
    updateTutor,
    removeTutor,
    setBookingStatus,
    signOut,
    setRole,
    notify,
  } = useApp();

  const tutor = (user && tutors.find((item) => item.ownerId === user.id))
    ?? tutors.find((item) => item.id === CURRENT_TUTOR_ID)
    ?? tutors[0];
  const activeTutorId = tutor?.id ?? CURRENT_TUTOR_ID;

  const [tab, setTab] = useState<DashboardTab>('overview');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [extras, setExtras] = useState<TutorExtras>(() => getTutorExtras(activeTutorId));

  // Sync extras when tutor changes
  const mergedExtras = useMemo(
    () => ({ ...getTutorExtras(activeTutorId), ...extras }),
    [activeTutorId, extras],
  );

  // Modal local form state
  const [firstNameDraft, setFirstNameDraft] = useState('');
  const [lastNameDraft, setLastNameDraft] = useState('');
  const [cityDraft, setCityDraft] = useState('');
  const [headlineDraft, setHeadlineDraft] = useState('');
  const [bioDraft, setBioDraft] = useState('');
  const [expBandDraft, setExpBandDraft] = useState<ExperienceBand>('3-5');
  const [whatsappDraft, setWhatsappDraft] = useState('');

  const [subjectDraft, setSubjectDraft] = useState('english');
  const [specialtiesDraft, setSpecialtiesDraft] = useState<SpecialtyId[]>([]);
  const [modesDraft, setModesDraft] = useState<TeachingMode[]>(['online']);
  const [rateDraft, setRateDraft] = useState(120);
  const [trialDraft, setTrialDraft] = useState(true);
  const [daysDraft, setDaysDraft] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const [photoDraft, setPhotoDraft] = useState('');
  const [notifDraft, setNotifDraft] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);
  const [modalError, setModalError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const diplomaInputRef = useRef<HTMLInputElement>(null);
  const cinInputRef = useRef<HTMLInputElement>(null);

  const tutorBookings = useMemo(
    () =>
      bookings
        .filter((booking) => booking.tutorId === activeTutorId)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [bookings, activeTutorId],
  );

  const visibleBookings = tutorBookings.filter(
    (booking) => booking.status === 'pending' || booking.status === 'accepted',
  );
  const pendingCount = tutorBookings.filter((booking) => booking.status === 'pending').length;

  const firstNameDisplay = mergedExtras.firstName || tutor?.firstName || tutor?.name.split(' ')[0] || 'Tutor';
  const primarySubjectLabel = tutor?.subjectIds[0] ? subjectLabel(tutor.subjectIds[0], lang) : '';
  const offersFreeTrial = mergedExtras.offersFreeTrial ?? tutor?.offersFreeTrial ?? true;
  const diplomas = mergedExtras.diplomas ?? [];
  const cinDocs = mergedExtras.cinDocs ?? [];

  const openGeneralModal = () => {
    if (!tutor) return;
    const [first, ...rest] = tutor.name.split(' ');
    setFirstNameDraft(mergedExtras.firstName || tutor.firstName || first || '');
    setLastNameDraft(mergedExtras.lastName || tutor.lastName || rest.join(' ') || '');
    setCityDraft(tutor.cityId);
    setHeadlineDraft(tutor.headline[lang]);
    setBioDraft(tutor.bio[lang]);
    setExpBandDraft(mergedExtras.experienceBand || tutor.experienceBand || '3-5');
    setWhatsappDraft((mergedExtras.whatsapp || tutor.phone || '').replace(/^\+212/, ''));
    setModalError(null);
    setActiveModal('general');
  };

  const openTeachingModal = () => {
    if (!tutor) return;
    setSubjectDraft(tutor.subjectIds[0] ?? 'english');
    setSpecialtiesDraft(mergedExtras.specialties ?? tutor.specialties ?? ['conversation']);
    setModesDraft(tutor.modes);
    setRateDraft(tutor.pricePerHour);
    setTrialDraft(offersFreeTrial);
    setDaysDraft(tutor.availableDays);
    setModalError(null);
    setActiveModal('teaching');
  };

  const openPhotoModal = () => {
    setPhotoDraft(tutor?.avatar ?? '');
    setModalError(null);
    setActiveModal('photo');
  };

  const openNotifModal = () => {
    setNotifDraft(mergedExtras.notifications ?? DEFAULT_NOTIFICATIONS);
    setModalError(null);
    setActiveModal('notifications');
  };

  const handleSaveGeneral = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tutor) return;
    if (firstNameDraft.trim().length < 2) {
      setModalError(t('errName'));
      return;
    }
    if (bioDraft.trim().length < 20) {
      setModalError(t('errTutorBio'));
      return;
    }
    if (whatsappDraft.trim() && !isValidMoroccoWhatsapp(whatsappDraft)) {
      setModalError(t('errWhatsapp'));
      return;
    }

    const expYears = EXPERIENCE_BANDS.find((item) => item.id === expBandDraft)?.years ?? tutor.experienceYears;
    const formattedPhone = whatsappDraft.trim() ? formatMoroccoWhatsapp(whatsappDraft) : tutor.phone;

    updateTutor(tutor.id, {
      name: firstNameDraft.trim(),
      firstName: firstNameDraft.trim(),
      lastName: lastNameDraft.trim(),
      cityId: cityDraft || tutor.cityId,
      headline: { ...tutor.headline, [lang]: headlineDraft.trim() },
      bio: { ...tutor.bio, [lang]: bioDraft.trim() },
      experienceYears: expYears,
      experienceBand: expBandDraft,
      phone: formattedPhone,
    });

    const nextExtras = saveTutorExtras(tutor.id, {
      firstName: firstNameDraft.trim(),
      lastName: lastNameDraft.trim(),
      whatsapp: formattedPhone,
      experienceBand: expBandDraft,
    });
    setExtras(nextExtras);
    notify(t('toastListingSaved'));
    setActiveModal(null);
  };

  const handleSaveTeaching = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tutor) return;
    if (modesDraft.length === 0) {
      setModalError(t('errModes'));
      return;
    }
    if (daysDraft.length === 0) {
      setModalError(t('errDays'));
      return;
    }

    updateTutor(tutor.id, {
      subjectIds: [subjectDraft],
      specialties: specialtiesDraft,
      modes: modesDraft,
      pricePerHour: rateDraft,
      offersFreeTrial: trialDraft,
      availableDays: daysDraft,
    });

    const nextExtras = saveTutorExtras(tutor.id, {
      specialties: specialtiesDraft,
      offersFreeTrial: trialDraft,
    });
    setExtras(nextExtras);
    notify(t('toastListingSaved'));
    setActiveModal(null);
  };

  const handleSelectPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 360);
      setPhotoDraft(compressed);
      setModalError(null);
    } catch {
      setModalError(t('tutorSaveFailed'));
    }
  };

  const handleSavePhoto = () => {
    if (!tutor) return;
    updateTutor(tutor.id, { avatar: photoDraft });
    notify(t('toastPhotoSaved'));
    setActiveModal(null);
  };

  const handleUploadDoc = async (event: ChangeEvent<HTMLInputElement>, folder: 'diplomas' | 'cin') => {
    const file = event.target.files?.[0];
    if (!file || !tutor) return;
    setUploading(true);
    setModalError(null);
    try {
      const doc: UploadedDoc = await uploadToPrivateBucket(file, folder, user?.id ?? tutor.id);
      const nextList = folder === 'diplomas' ? [doc, ...diplomas] : [doc, ...cinDocs];
      const nextExtras = saveTutorExtras(
        tutor.id,
        folder === 'diplomas' ? { diplomas: nextList } : { cinDocs: nextList },
      );
      setExtras(nextExtras);
      notify(t('toastDocUploaded'));
    } catch {
      setModalError(t('tutorSaveFailed'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSaveNotifications = () => {
    if (!tutor) return;
    const nextExtras = saveTutorExtras(tutor.id, { notifications: notifDraft });
    setExtras(nextExtras);
    notify(t('toastNotifSaved'));
    setActiveModal(null);
  };

  const handleDeleteAccount = async () => {
    if (tutor) {
      clearTutorExtras(tutor.id);
      await removeTutor(tutor.id);
    }
    await signOut();
    setRole('visitor');
    setActiveModal(null);
    notify(t('toastAccountDeleted'));
  };

  const toggleItem = <T,>(list: T[], item: T): T[] =>
    list.includes(item) ? list.filter((value) => value !== item) : [...list, item];

  const actionCards: {
    key: Exclude<ActiveModal, null>;
    title: string;
    desc: string;
    status?: string;
    icon: typeof UserCog;
    tone: 'default' | 'success' | 'danger';
    onOpen: () => void;
  }[] = [
    {
      key: 'general',
      title: t('actionGeneralInfo'),
      desc: t('actionGeneralInfoDesc'),
      icon: UserCog,
      tone: 'default',
      onOpen: openGeneralModal,
    },
    {
      key: 'teaching',
      title: t('actionTeachingPricing'),
      desc: t('actionTeachingPricingDesc'),
      icon: BookOpen,
      tone: 'default',
      onOpen: openTeachingModal,
    },
    {
      key: 'photo',
      title: t('actionProfilePhoto'),
      desc: t('actionProfilePhotoDesc'),
      icon: Camera,
      tone: 'default',
      onOpen: openPhotoModal,
    },
    {
      key: 'diplomas',
      title: t('actionDiplomas'),
      desc: t('actionDiplomasDesc'),
      status: diplomas.length > 0 ? t('docUploadedStatus') : t('docRequiredStatus'),
      icon: Award,
      tone: diplomas.length > 0 ? 'success' : 'default',
      onOpen: () => {
        setModalError(null);
        setActiveModal('diplomas');
      },
    },
    {
      key: 'cin',
      title: t('actionCin'),
      desc: t('actionCinDesc'),
      status: cinDocs.length > 0 ? t('docUploadedStatus') : t('docRequiredStatus'),
      icon: CreditCard,
      tone: cinDocs.length > 0 ? 'success' : 'default',
      onOpen: () => {
        setModalError(null);
        setActiveModal('cin');
      },
    },
    {
      key: 'notifications',
      title: t('actionNotifications'),
      desc: t('actionNotificationsDesc'),
      icon: Bell,
      tone: 'default',
      onOpen: openNotifModal,
    },
    {
      key: 'delete',
      title: t('actionDeleteAccount'),
      desc: t('actionDeleteAccountDesc'),
      icon: Trash2,
      tone: 'danger',
      onOpen: () => setActiveModal('delete'),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      {/* Header + Mobile-first Two-Tab Switcher */}
      <div className="flex flex-col gap-4 border-b border-secondary-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-primary-950">{t('tutorTitle')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('tutorSubtitle')}</p>
        </div>

        <div
          role="tablist"
          aria-label={t('tutorTitle')}
          className="grid w-full grid-cols-2 rounded-2xl bg-secondary-100 p-1 sm:w-auto sm:min-w-[320px]"
        >
          {(
            [
              { id: 'overview' as const, label: t('tabOverview') },
              { id: 'profile' as const, label: t('tabProfileVerification') },
            ]
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`min-h-[44px] whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'bg-primary-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-primary-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Profile Summary Card */}
          <section className="rounded-3xl border border-secondary-200 bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <Avatar src={tutor?.avatar} name={firstNameDisplay} size="lg" />
                  <button
                    type="button"
                    onClick={openPhotoModal}
                    aria-label={t('actionProfilePhoto')}
                    className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white shadow-sm transition hover:bg-primary-600"
                  >
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-extrabold text-primary-950">{firstNameDisplay}</h2>
                    {primarySubjectLabel && (
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700 ring-1 ring-primary-200">
                        {primarySubjectLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 tabular-nums">
                    {formatNumber(tutor?.pricePerHour ?? 120)} {t('currency')} {t('perHour')}
                    {' · '}
                    {cityLabel(tutor?.cityId ?? 'casablanca', lang)}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                icon={<Pencil className="h-4 w-4" aria-hidden="true" />}
                onClick={openGeneralModal}
                className="min-h-[44px] w-full sm:w-auto"
              >
                {t('editProfileBtn')}
              </Button>
            </div>
          </section>

          {/* 3 Horizontal Status Cards */}
          <section aria-label={t('verificationStatusLabel')} className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="rounded-2xl border border-secondary-200 bg-white p-3.5 shadow-card sm:p-5">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    tutor?.verified ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                  }`}
                >
                  {tutor?.verified ? (
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <p className="truncate text-xs font-medium text-slate-500">{t('verificationStatusLabel')}</p>
              </div>
              <p className="mt-2.5 text-xs font-bold text-primary-950 sm:text-sm">
                {tutor?.verified ? t('verifiedStatusLabel') : t('pendingQualityCheck')}
              </p>
            </div>

            <div className="rounded-2xl border border-secondary-200 bg-white p-3.5 shadow-card sm:p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                </span>
                <p className="truncate text-xs font-medium text-slate-500">{t('reviewsCountLabel')}</p>
              </div>
              <p className="mt-2.5 text-lg font-extrabold tabular-nums text-primary-950 sm:text-xl">
                {formatNumber(tutor?.reviewCount ?? 0)}
              </p>
            </div>

            <div className="rounded-2xl border border-secondary-200 bg-white p-3.5 shadow-card sm:p-5">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    offersFreeTrial ? 'bg-success-50 text-success-700' : 'bg-secondary-100 text-slate-500'
                  }`}
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="truncate text-xs font-medium text-slate-500">{t('freeTrialStatusLabel')}</p>
              </div>
              <p className="mt-2.5 text-xs font-bold text-primary-950 sm:text-sm">
                {offersFreeTrial ? t('freeTrialActive') : t('freeTrialInactive')}
              </p>
            </div>
          </section>

          {/* My Lesson Requests */}
          <section className="space-y-4" aria-labelledby="tutor-requests-heading">
            <div className="flex items-center justify-between gap-3">
              <h2 id="tutor-requests-heading" className="text-lg font-extrabold text-primary-950">
                {t('myLessonRequests')}
              </h2>
              <span className="text-xs font-semibold tabular-nums text-primary-700">
                {t('newRequestsCount', { count: pendingCount })}
              </span>
            </div>

            {visibleBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-secondary-300 bg-secondary-50/60 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-primary-950">{t('requestsEmpty')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleBookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-card sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          aria-hidden="true"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700"
                        >
                          {initials(booking.studentName)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-primary-950">{booking.studentName}</h3>
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                            {t('sessionAt', {
                              date: formatDate(booking.date, lang, { weekday: 'short', day: 'numeric', month: 'short' }),
                              time: booking.time,
                            })}
                            {' · '}
                            {t(booking.mode === 'online' ? 'modeOnline' : 'modeInPerson')}
                          </p>
                        </div>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-[44px]"
                            onClick={async () => {
                              const ok = await setBookingStatus(booking.id, 'declined');
                              if (ok) notify(t('toastDeclined'));
                            }}
                            icon={<X className="h-4 w-4" aria-hidden="true" />}
                          >
                            {t('decline')}
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            className="min-h-[44px] bg-primary-950 text-white"
                            onClick={async () => {
                              const ok = await setBookingStatus(booking.id, 'accepted');
                              if (ok) notify(t('toastAccepted'));
                            }}
                            icon={<Check className="h-4 w-4" aria-hidden="true" />}
                          >
                            {t('accept')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 2: PROFILE & VERIFICATION */}
      {tab === 'profile' && (
        <section className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in" aria-label={t('tabProfileVerification')}>
          {actionCards.map(({ key, title, desc, status, icon: Icon, tone, onOpen }) => (
            <button
              key={key}
              type="button"
              onClick={onOpen}
              className={`flex min-h-[128px] flex-col items-start justify-between rounded-2xl border p-4 text-start transition hover:-translate-y-0.5 hover:shadow-card-hover sm:p-5 ${
                tone === 'danger'
                  ? 'border-error-100 bg-error-50/40 hover:border-error-500/40'
                  : 'border-secondary-200 bg-white shadow-card hover:border-primary-300'
              }`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    tone === 'danger'
                      ? 'bg-error-100 text-error-700'
                      : tone === 'success'
                        ? 'bg-success-50 text-success-700'
                        : 'bg-primary-50 text-primary-600'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {status && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      tone === 'success'
                        ? 'bg-success-50 text-success-700'
                        : 'bg-secondary-100 text-slate-600'
                    }`}
                  >
                    {tone === 'success' && <Check className="h-3 w-3" aria-hidden="true" />}
                    {status}
                  </span>
                )}
              </div>

              <div className="mt-3 w-full">
                <h3 className={`text-sm font-bold sm:text-base ${tone === 'danger' ? 'text-error-700' : 'text-primary-950'}`}>
                  {title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{desc}</p>
              </div>
            </button>
          ))}
        </section>
      )}

      {/* MODAL 1: GENERAL INFO */}
      {activeModal === 'general' && (
        <Modal
          title={t('actionGeneralInfo')}
          onClose={() => setActiveModal(null)}
          size="lg"
          footer={
            <Button type="submit" form="general-info-form" block className="min-h-[44px] bg-primary-950 text-white">
              {t('saveChanges')}
            </Button>
          }
        >
          <form id="general-info-form" onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('firstNameLabel')}>
                <TextInput value={firstNameDraft} onChange={(e) => setFirstNameDraft(e.target.value)} />
              </Field>
              <Field label={t('lastNameLabel')}>
                <TextInput value={lastNameDraft} onChange={(e) => setLastNameDraft(e.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('fieldCity')}>
                <select value={cityDraft} onChange={(e) => setCityDraft(e.target.value)} className={`${inputClass} bg-white`}>
                  {CITIES.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.label[lang]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('whatsappLabel')}>
                <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <span dir="ltr" className="border-e border-slate-200 bg-secondary-50 px-3 py-3 text-sm font-bold text-primary-950">
                    +212
                  </span>
                  <input
                    type="tel"
                    dir="ltr"
                    value={whatsappDraft}
                    onChange={(e) => setWhatsappDraft(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-primary-950 focus:outline-none"
                  />
                </div>
              </Field>
            </div>

            <Field label={t('wizardHeadlineLabel')}>
              <TextInput value={headlineDraft} onChange={(e) => setHeadlineDraft(e.target.value)} />
            </Field>

            <Field label={t('wizardBioLabel')}>
              <textarea
                rows={4}
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium text-primary-950">{t('wizardExperienceLabel')}</p>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCE_BANDS.map((band) => (
                  <button
                    key={band.id}
                    type="button"
                    aria-pressed={expBandDraft === band.id}
                    onClick={() => setExpBandDraft(band.id)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      expBandDraft === band.id
                        ? 'border-primary-950 bg-primary-950 text-white'
                        : 'border-secondary-200 bg-white text-slate-700'
                    }`}
                  >
                    {band.label[lang]}
                  </button>
                ))}
              </div>
            </div>

            {modalError && <p role="alert" className="text-sm font-medium text-error-600">{modalError}</p>}
          </form>
        </Modal>
      )}

      {/* MODAL 2: TEACHING & PRICING */}
      {activeModal === 'teaching' && (
        <Modal
          title={t('actionTeachingPricing')}
          onClose={() => setActiveModal(null)}
          size="lg"
          footer={
            <Button type="submit" form="teaching-pricing-form" block className="min-h-[44px] bg-primary-950 text-white">
              {t('saveChanges')}
            </Button>
          }
        >
          <form id="teaching-pricing-form" onSubmit={handleSaveTeaching} className="space-y-5">
            <Field label={t('fieldSubject')}>
              <select value={subjectDraft} onChange={(e) => setSubjectDraft(e.target.value)} className={`${inputClass} bg-white`}>
                {SUBJECTS.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.label[lang]}
                  </option>
                ))}
              </select>
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium text-primary-950">{t('wizardSpecialtiesLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((item) => (
                  <Chip
                    key={item.id}
                    active={specialtiesDraft.includes(item.id)}
                    onClick={() => setSpecialtiesDraft((prev) => toggleItem(prev, item.id))}
                  >
                    {item.label[lang]}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-primary-950">{t('modesLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {(['online', 'in_person'] as const).map((mode) => (
                  <Chip
                    key={mode}
                    active={modesDraft.includes(mode)}
                    onClick={() => setModesDraft((prev) => toggleItem(prev, mode))}
                  >
                    {t(mode === 'online' ? 'modeOnline' : 'modeInPerson')}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-primary-950">
                {t('priceLabel')} ({t('wizardRateUnit')})
              </p>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRateDraft((prev) => Math.max(50, prev - 10))}
                  className="min-h-[44px] min-w-[44px] px-0"
                >
                  -
                </Button>
                <span className="min-w-[90px] text-center text-xl font-extrabold tabular-nums text-primary-950">
                  {formatNumber(rateDraft)} {t('currency')}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRateDraft((prev) => Math.min(600, prev + 10))}
                  className="min-h-[44px] min-w-[44px] px-0"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-secondary-200 p-4">
              <span className="text-sm font-semibold text-primary-950">{t('wizardFreeTrialLabel')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={trialDraft}
                onClick={() => setTrialDraft((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  trialDraft ? 'bg-primary-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    trialDraft ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'ltr:translate-x-1 rtl:-translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-primary-950">{t('daysLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => (
                  <Chip
                    key={day}
                    active={daysDraft.includes(day)}
                    onClick={() => setDaysDraft((prev) => toggleItem(prev, day))}
                  >
                    {formatWeekday(day, lang)}
                  </Chip>
                ))}
              </div>
            </div>

            {modalError && <p role="alert" className="text-sm font-medium text-error-600">{modalError}</p>}
          </form>
        </Modal>
      )}

      {/* MODAL 3: PROFILE PHOTO */}
      {activeModal === 'photo' && (
        <Modal
          title={t('actionProfilePhoto')}
          onClose={() => setActiveModal(null)}
          footer={
            <Button block className="min-h-[44px] bg-primary-950 text-white" onClick={handleSavePhoto}>
              {t('saveChanges')}
            </Button>
          }
        >
          <div className="space-y-4 text-center">
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handleSelectPhoto} className="sr-only" />
            <div className="mx-auto flex justify-center">
              <Avatar src={photoDraft} name={firstNameDisplay} size="xl" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Upload className="h-4 w-4" />}
                onClick={() => photoInputRef.current?.click()}
              >
                {t('wizardChangePhoto')}
              </Button>
              {photoDraft && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => setPhotoDraft('')}
                >
                  {t('wizardRemovePhoto')}
                </Button>
              )}
            </div>
            {modalError && <p role="alert" className="text-sm text-error-600">{modalError}</p>}
          </div>
        </Modal>
      )}

      {/* MODAL 4 & 5: DIPLOMAS / CIN (tutor-private-uploads bucket) */}
      {(activeModal === 'diplomas' || activeModal === 'cin') && (
        <Modal
          title={activeModal === 'diplomas' ? t('actionDiplomas') : t('actionCin')}
          onClose={() => setActiveModal(null)}
          footer={
            <Button variant="outline" block className="min-h-[44px]" onClick={() => setActiveModal(null)}>
              {t('done')}
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-2xl bg-secondary-50 p-4 text-xs leading-relaxed text-slate-600 ring-1 ring-secondary-200">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
              <span>{t('privateBucketNote')}</span>
            </div>

            <input
              ref={activeModal === 'diplomas' ? diplomaInputRef : cinInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) => handleUploadDoc(event, activeModal === 'diplomas' ? 'diplomas' : 'cin')}
              className="sr-only"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => (activeModal === 'diplomas' ? diplomaInputRef.current : cinInputRef.current)?.click()}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/40 px-4 py-8 text-center transition hover:border-primary-500 hover:bg-primary-50 disabled:opacity-50"
            >
              <Upload className="h-6 w-6 text-primary-600" aria-hidden="true" />
              <span className="mt-2 text-sm font-bold text-primary-950">{t('uploadDocumentBtn')}</span>
            </button>

            {(activeModal === 'diplomas' ? diplomas : cinDocs).length > 0 && (
              <ul className="space-y-2">
                {(activeModal === 'diplomas' ? diplomas : cinDocs).map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <FileText className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                      <span className="truncate text-sm font-medium text-primary-950">{doc.name}</span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      {t('docUploadedStatus')}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {modalError && <p role="alert" className="text-sm text-error-600">{modalError}</p>}
          </div>
        </Modal>
      )}

      {/* MODAL 6: NOTIFICATIONS */}
      {activeModal === 'notifications' && (
        <Modal
          title={t('actionNotifications')}
          onClose={() => setActiveModal(null)}
          footer={
            <Button block className="min-h-[44px] bg-primary-950 text-white" onClick={handleSaveNotifications}>
              {t('saveChanges')}
            </Button>
          }
        >
          <div className="space-y-3">
            {(
              [
                { key: 'lessonRequests' as const, label: t('notifRequests') },
                { key: 'bookingReminders' as const, label: t('notifReminders') },
                { key: 'platformUpdates' as const, label: t('notifUpdates') },
              ]
            ).map(({ key, label }) => {
              const checked = notifDraft[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-secondary-200 p-4"
                >
                  <span className="text-sm font-semibold text-primary-950">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={label}
                    onClick={() => setNotifDraft((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      checked ? 'bg-primary-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                        checked ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'ltr:translate-x-1 rtl:-translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* MODAL 7: DELETE ACCOUNT */}
      {activeModal === 'delete' && (
        <Modal
          title={t('deleteConfirmTitle')}
          onClose={() => setActiveModal(null)}
          footer={
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="min-h-[44px]" onClick={() => setActiveModal(null)}>
                {t('discard')}
              </Button>
              <Button
                className="min-h-[44px] bg-error-600 text-white hover:bg-error-700"
                onClick={handleDeleteAccount}
              >
                {t('confirmDeleteBtn')}
              </Button>
            </div>
          }
        >
          <p className="text-sm leading-relaxed text-slate-600">{t('deleteConfirmBody')}</p>
        </Modal>
      )}
    </div>
  );
}
