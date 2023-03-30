import { Switch as BaseSwitch } from '@headlessui/react';
import { tw } from '../tw';

export function Switch({ checked, onChange, label, className }) {
  return (
    <BaseSwitch
      checked={checked}
      onChange={onChange}
      className={tw(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-green-500',
        checked ? 'bg-green-700' : 'bg-white/20',
        className,
      )}
    >
      {label && <span className="sr-only">{label}</span>}
      <span
        aria-hidden="true"
        className={tw(
          checked ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0',
        )}
      />
    </BaseSwitch>
  );
}
