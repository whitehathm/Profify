import { GraduationCap, LogIn, LogOut } from 'lucide-react';
import type { Lang } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Segmented, type SegmentOption } from '@/components/ui/Segmented';
import { initials } from '@/lib/format';

const LANG_OPTIONS: SegmentOption<Lang>[] = [
  { value: 'ar', label: 'AR' },
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
];

export function Header() {
  const { t, lang, setLang, user, signOut, notify, openModal } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6366F1] text-white shadow-sm">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">Profify</span>
        </div>

        <div className="flex items-center gap-2">
          <Segmented label="Language" compact options={LANG_OPTIONS} value={lang} onChange={setLang} />

          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-[#4F46E5]">
                {initials(user.name)}
              </span>
              <button
                type="button"
                title={t('logout')}
                aria-label={t('logout')}
                onClick={() => {
                  signOut();
                  notify(t('toastLoggedOut'));
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-primary-900"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              <span className="sm:hidden">
                <Button variant="outline" size="sm" icon={<LogIn className="h-4 w-4" />} onClick={() => openModal({ type: 'auth', mode: 'login' })}>
                  {t('login')}
                </Button>
              </span>
              <span className="hidden sm:inline-flex sm:items-center sm:gap-2">
                <Button variant="ghost" size="sm" onClick={() => openModal({ type: 'auth', mode: 'login' })}>
                  {t('login')}
                </Button>
                <Button size="sm" onClick={() => openModal({ type: 'auth', mode: 'register' })}>
                  {t('register')}
                </Button>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
