import { BookOpen, Check, Compass, CircleUser, GraduationCap, Globe, ListOrdered, LogOut, Mail, Menu, Search } from 'lucide-react';
import type { Lang } from '@/types';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { PopoverMenu, type PopoverMenuItem } from '@/components/ui/PopoverMenu';

const LANG_OPTIONS: { value: Lang; code: string; label: string }[] = [
  { value: 'ar', code: 'AR', label: 'العربية' },
  { value: 'fr', code: 'FR', label: 'Français' },
  { value: 'en', code: 'EN', label: 'English' },
];

const ICON_TRIGGER_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-full text-primary-950 transition duration-200 hover:bg-primary-50 active:scale-95';

const ICON_PROPS = { className: 'h-4 w-4', strokeWidth: 1.75, 'aria-hidden': true } as const;

export function Header() {
  const {
    t,
    lang,
    setLang,
    role,
    setRole,
    view,
    navigate,
    user,
    currentTutor,
    hasTutorProfile,
    signOut,
    notify,
    openModal,
  } = useApp();

  const isTutorAccount = hasTutorProfile || role === 'tutor';

  const languageItems: PopoverMenuItem[] = LANG_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
    active: option.value === lang,
    icon: option.value === lang ? <Check {...ICON_PROPS} className="h-4 w-4 text-primary-600" /> : <span className="h-4 w-4" aria-hidden="true" />,
    onSelect: () => setLang(option.value),
  }));

  const logoutItem: PopoverMenuItem = {
    key: 'logout',
    label: t('logout'),
    icon: <LogOut {...ICON_PROPS} />,
    onSelect: async () => {
      const signedOut = await signOut();
      notify(t(signedOut ? 'toastLoggedOut' : 'authUnexpected'));
    },
  };

  const accountItems: PopoverMenuItem[] = isTutorAccount
    ? [
        {
          key: 'tutor-dashboard',
          label: t('tutorTitle'),
          icon: <BookOpen {...ICON_PROPS} />,
          active: role === 'tutor',
          onSelect: () => setRole('tutor'),
        },
        logoutItem,
      ]
    : [
        { key: 'visitor', label: t('browseTutors'), icon: <Compass {...ICON_PROPS} />, active: role === 'visitor', onSelect: () => setRole('visitor') },
        { key: 'student', label: t('roleStudent'), icon: <GraduationCap {...ICON_PROPS} />, active: role === 'student', onSelect: () => setRole('student') },
        { key: 'tutor', label: t('roleTutor'), icon: <BookOpen {...ICON_PROPS} />, active: false, onSelect: () => setRole('tutor') },
        logoutItem,
      ];

  const tutorHeader = isTutorAccount && user ? (
    <div className="flex items-center gap-2.5">
      <Avatar
        src={currentTutor?.avatar}
        name={currentTutor?.firstName || currentTutor?.name || user.name}
        size="sm"
      />
      <div className="min-w-0 flex-1 text-start">
        <p className="truncate text-sm font-bold text-primary-950">
          {currentTutor?.firstName || currentTutor?.name || user.name}
        </p>
        <p className="truncate text-xs text-slate-500">
          {currentTutor
            ? (currentTutor.verified ? t('verifiedLiveLabel') : t('underQualityReviewLabel'))
            : t('tutorAccountBadge')}
        </p>
      </div>
    </div>
  ) : undefined;

  const navItems: PopoverMenuItem[] = [
    { key: 'discover', label: t('navFindTutoring'), icon: <Search {...ICON_PROPS} />, active: view === 'discover' && role === 'visitor', onSelect: () => navigate('discover') },
    { key: 'how-it-works', label: t('navHowItWorks'), icon: <ListOrdered {...ICON_PROPS} />, active: view === 'how-it-works', onSelect: () => navigate('how-it-works') },
    ...(!isTutorAccount
      ? [{ key: 'become-tutor', label: t('navBecomeTutor'), icon: <GraduationCap {...ICON_PROPS} />, active: view === 'become-tutor', onSelect: () => navigate('become-tutor') }]
      : []),
    { key: 'contact', label: t('navContact'), icon: <Mail {...ICON_PROPS} />, active: view === 'contact', onSelect: () => navigate('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-secondary-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('discover')}
          className="flex items-center gap-2.5 rounded-full transition duration-200 active:scale-[0.98]"
          aria-label="Profify"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="40" height="40" rx="11" fill="#FF5A79" />
            <path
              d="M14.5 29V15.5C14.5 12.4624 16.9624 10 20 10H22.5C25.8137 10 28.5 12.6863 28.5 16C28.5 19.3137 25.8137 22 22.5 22H18.5"
              stroke="#FFFFFF"
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="22.5" cy="28" r="2.4" fill="#FFFFFF" />
          </svg>

          <span className="text-xl font-extrabold tracking-tight text-[#121117]">
            Profify
          </span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <PopoverMenu
            ariaLabel="Language"
            triggerClassName={ICON_TRIGGER_CLASS}
            trigger={<Globe className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
            items={languageItems}
          />

          {user ? (
            <PopoverMenu
              ariaLabel={t('dashboardLabel')}
              triggerClassName={ICON_TRIGGER_CLASS}
              trigger={<CircleUser className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
              header={tutorHeader}
              items={accountItems}
            />
          ) : (
            <button
              type="button"
              aria-label={t('login')}
              onClick={() => openModal({ type: 'auth', mode: 'login' })}
              className={ICON_TRIGGER_CLASS}
            >
              <CircleUser className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}

          <PopoverMenu
            ariaLabel={t('navFindTutoring')}
            triggerClassName={ICON_TRIGGER_CLASS}
            trigger={<Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
            items={navItems}
          />
        </div>
      </div>
    </header>
  );
}
