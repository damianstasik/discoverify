import { twMerge } from 'tailwind-merge';
import { Icon } from './Icon';
import { forwardRef } from 'react';

interface Props {
  label?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
  icon: string;
}

export const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(({ label, icon, onClick, className, href, target }, ref) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      type={href ? undefined : 'button'}
      className={twMerge(
        'flex-shrink-0 focus:ring-1 focus:outline-none rounded-lg s-8 p-1 inline-flex text-base items-center justify-center hover:text-white focus:ring-white/50 hover:bg-white/20',
        className,
      )}
      onClick={onClick}
      target={target}
      href={href}
      ref={ref}
    >
      <Icon path={icon} className="s-full" />
      {label && <span className="sr-only">{label}</span>}
    </Component>
  );
});
