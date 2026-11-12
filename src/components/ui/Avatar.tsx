import { Star } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-primary-50 font-bold text-primary-700 ring-1 ring-primary-100 ${SIZES[size]} ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={`shrink-0 rounded-2xl object-cover ring-2 ring-white shadow-sm ${SIZES[size]} ${className}`}
    />
  );
}

export function RatingStars({ rating, count, className = '' }: { rating: number; count?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
      <Star className="h-4 w-4 fill-warning-500 text-warning-500" aria-hidden="true" />
      <span className="font-semibold text-primary-950">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-slate-500">({count})</span>}
    </span>
  );
}
