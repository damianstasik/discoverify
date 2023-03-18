import { useEffect, useRef } from 'react';

export const CheckboxColumn = ({ onChange, checked, indeterminate }) => {
  const checkboxRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="cursor-pointer">
      <input
        checked={checked}
        onChange={onChange}
        type="checkbox"
        className="cursor-pointer h-5 w-5 rounded bg-neutral-900 border-neutral-700 text-green-700 focus:ring-green-500 focus:ring-offset-neutral-900"
      />
    </label>
  );
};
