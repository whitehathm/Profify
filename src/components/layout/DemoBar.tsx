import { BookOpen, Eye, GraduationCap } from 'lucide-react';
import type { Role } from '@/types';
import { useApp } from '@/context/AppContext';
import { Segmented, type SegmentOption } from '@/components/ui/Segmented';

export function DemoBar() {
  const { t, role, setRole } = useApp();

  const options: SegmentOption<Role>[] = [
    { value: 'visitor', label: t('roleVisitor'), icon: <Eye className="h-3.5 w-3.5" aria-hidden="true" /> },
    { value: 'student', label: t('roleStudent'), icon: <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> },
    { value: 'tutor', label: t('roleTutor'), icon: <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> },
  ];

  return (
    <div className="border-b border-secondary-200 bg-secondary-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <span className="text-xs font-medium text-slate-500">{t('previewAs')}</span>
        <Segmented compact label={t('previewAs')} options={options} value={role} onChange={setRole} />
      </div>
    </div>
  );
}
