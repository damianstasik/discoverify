import { CircularProgress } from './CircularProgress';
import { tw } from '../tw';

interface Props {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary';
  loading?: boolean;
  onClick?: () => void;
  variant?: 'contained' | 'outlined';
}

export function Button({
  children,
  className,
  disabled,
  color = 'primary',
  loading,
  variant = 'contained',
  onClick,
  component,
  ...rest
}: Props) {
  const Component = component || 'button';
  return (
    <Component
      type={component ? undefined : 'button'}
      className={tw(
        'inline-flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-white focus:outline-none focus:ring-1',

        color === 'primary' && [
          variant === 'contained' &&
            'bg-green-700 hover:bg-green-800 focus:ring-green-600 active:bg-green-900',
          variant === 'outlined' &&
            'border-green-700 hover:bg-green-800 focus:ring-green-600 active:bg-green-500/10',
        ],
        (loading || disabled) && 'bg-slate-500 cursor-default',
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
      {loading && <CircularProgress className="ml-2" />}
    </Component>
  );
}
