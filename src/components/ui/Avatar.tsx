import clsx from 'clsx';
import { Img } from './Img';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

const dotSizeMap = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4 w-4',
};

/** Avatar prestataire/client avec indicateur "en ligne" optionnel. */
export default function Avatar({ src, name, size = 'md', isOnline, className }: AvatarProps) {
  const fallback = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=2d5bff`;

  return (
    <div className={clsx('relative inline-block shrink-0', sizeMap[size], className)}>
      <Img
        src={src || fallback}
        alt={name}
        className="h-full w-full rounded-full object-cover ring-2 ring-surface"
      />
      {isOnline && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full bg-success ring-2 ring-surface',
            dotSizeMap[size]
          )}
        />
      )}
    </div>
  );
}