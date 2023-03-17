import { twMerge } from 'tailwind-merge';
import { Icon } from './Icon';
import { forwardRef } from 'react';

interface Props {
  label?: string;
  onClick?: () => void;
  className?: string;
  icon: string;
}

export const IconButton = forwardRef<HTMLButtonElement>(
  ({ label, icon, onClick, className }: Props, ref) => {
    return (
      <button
        type="button"
        className={twMerge(
          'focus:ring-1 focus:outline-none rounded-lg p-2.5 inline-flex text-base items-center hover:text-white focus:ring-white/50 hover:bg-white/20',
          className,
        )}
        onClick={onClick}
        ref={ref}
      >
        <Icon path={icon} className="w-[1.5em] h-[1.5em]" />
        {label && <span className="sr-only">{label}</span>}
      </button>
    );
  },
);
