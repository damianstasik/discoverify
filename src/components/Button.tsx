import { twMerge } from 'tailwind-merge';
import { CircularProgress } from './CircularProgress';

export function Button({
  children,
  className,
  disabled,
  color,
  loading,
  onClick,
}) {
  return (
    <button
      type="button"
      className={twMerge(
        'inline-flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium text-white focus:outline-none focus:ring-2',
        !color && 'bg-green-700 hover:bg-green-800 focus:ring-green-600',
        (loading || disabled) && 'bg-neutral-600 cursor-default',
        className,
      )}
      onClick={onClick}
    >
      {children}
      {loading && <CircularProgress className="ml-2" />}
    </button>
  );
}
