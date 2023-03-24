import { useEffect, useRef } from 'react';

export const CheckboxColumn = ({ onChange, checked, indeterminate }) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && checkboxRef.current) {
      checkboxRef.current.indeterminate = !checked && indeterminate;
    }
  }, [checkboxRef, indeterminate]);

  return (
    <label className="cursor-pointer">
      <input
        ref={checkboxRef}
        checked={checked}
        onChange={onChange}
        type="checkbox"
        className="cursor-pointer h-5 w-5 rounded bg-slate-950 border-slate-550 text-green-700 focus:ring-green-500 focus:ring-offset-neutral-900"
      />
    </label>
  );
};
