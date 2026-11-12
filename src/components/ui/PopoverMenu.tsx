import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface PopoverMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onSelect: () => void;
}

interface PopoverMenuProps {
  ariaLabel: string;
  triggerClassName: string;
  trigger: ReactNode;
  items: PopoverMenuItem[];
}

export function PopoverMenu({ ariaLabel, triggerClassName, trigger, items }: PopoverMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 min-w-[12rem] origin-top-end animate-scale-in overflow-hidden rounded-2xl border border-secondary-200 bg-white p-1.5 shadow-card-hover"
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              aria-current={item.active ? 'true' : undefined}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-150 ${item.active ? 'bg-primary-50 text-primary-800' : 'text-primary-950 hover:bg-primary-50'}`}
            >
              {item.icon}
              <span className="flex-1 text-start">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
