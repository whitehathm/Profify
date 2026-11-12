const INK = '#121117';
const BLUSH = '#FFE0E7';
const CORAL = '#FF5A79';
const CORAL_SOFT = '#FFA3B7';

export function CoinIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden="true">
      <circle cx="80" cy="82" r="56" fill={BLUSH} />
      <path d="M46 84v14a24 9 0 0 0 48 0V84" fill={CORAL} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M46 98v14a24 9 0 0 0 48 0V98" fill={CORAL} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="70" cy="84" rx="24" ry="9" fill={CORAL_SOFT} stroke={INK} strokeWidth="3" />
      <circle cx="116" cy="50" r="16" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <text x="116" y="54" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>
        MAD
      </text>
      <path d="M130 88l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill={CORAL} />
      <circle cx="34" cy="50" r="3" fill={CORAL} />
    </svg>
  );
}

export function CalendarIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden="true">
      <circle cx="80" cy="82" r="56" fill={BLUSH} />
      <rect x="40" y="50" width="80" height="72" rx="14" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <path d="M40 64a14 14 0 0 1 14-14h52a14 14 0 0 1 14 14v8H40z" fill={CORAL} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M58 42v12M102 42v12" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="90" r="4" fill={CORAL_SOFT} />
      <circle cx="80" cy="90" r="4" fill={CORAL_SOFT} />
      <circle cx="100" cy="90" r="4" fill={CORAL_SOFT} />
      <circle cx="60" cy="106" r="4" fill={CORAL_SOFT} />
      <circle cx="80" cy="106" r="4" fill={CORAL_SOFT} />
      <circle cx="100" cy="106" r="9" fill={CORAL} stroke={INK} strokeWidth="2" />
      <path d="M96 106l3 3 6-6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M128 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={CORAL} />
    </svg>
  );
}

export function HeartHandIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden="true">
      <circle cx="80" cy="82" r="56" fill={BLUSH} />
      <path
        d="M80 92C62 80 54 70 58 60c4-10 18-10 22 0 4-10 18-10 22 0 4 10-4 20-22 32z"
        fill={CORAL}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M26 110q14-8 36-2l30 6q10 2 10 9 0 6-8 6l-26-2-18 2q-12 0-24-9z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M126 112q8 2 8 9-8 8-16 0z" fill={CORAL_SOFT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="128" cy="48" r="4" fill={CORAL} />
      <circle cx="36" cy="66" r="3" fill={CORAL} />
    </svg>
  );
}
